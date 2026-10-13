import { CachedImage } from '@/components/cached-image';
import { Tape } from '@/components/ui/decor';
import { Mono } from '@/components/ui/typography';
import { useHauntTheme } from '@/theme/colors';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer, VideoView } from 'expo-video';
import { X } from 'lucide-react-native';
import { useEffect, type ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MediaViewerProps = {
  url: string | null;
  kind: 'PHOTO' | 'VIDEO' | null;
  onClose: () => void; 
  /** Mono caption at the top right, e.g. `1 of 1`. */
  counter?: string;
  /** Content pinned under the media (e.g. the review actions). */
  footer?: ReactNode;
};

export function MediaViewer({ url, kind, onClose, counter = '1 of 1', footer }: MediaViewerProps) {
  const insets = useSafeAreaInsets();
  const { colors, isWhite } = useHauntTheme();
  const translateY = useSharedValue(0);
  const visible = Boolean(url && kind);

  useEffect(() => {
    if (visible) translateY.value = 0;
  }, [translateY, visible]);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (event.translationY > 120) {
        runOnJS(onClose)();
        return;
      }
      translateY.value = withSpring(0);
    });

  const sheet = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <StatusBar style="light" />
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.viewerBg }}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[{ flex: 1, backgroundColor: colors.viewerBg, paddingTop: insets.top + 18 }, sheet]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 18,
              }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={onClose}
                style={({ pressed }) => ({
                  width: 44,
                  height: 44,
                  borderRadius: 99,
                  borderWidth: 1.5,
                  borderColor: colors.viewerBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.7 : 1,
                })}>
                <X color={colors.viewerText} size={18} strokeWidth={2} />
              </Pressable>
              <Mono size={12} color={colors.viewerMute}>
                {counter}
              </Mono>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 24 }}>
              <View style={{ width: '100%', aspectRatio: 390 / 390, maxHeight: '100%' }}>
                {kind === 'PHOTO' && url ? (
                  <CachedImage
                    source={{ uri: url }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="contain"
                    accessibilityLabel="Guest photo"
                  />
                ) : null}
                {kind === 'VIDEO' && url ? <VideoStage url={url} /> : null}
                {isWhite && kind === 'PHOTO' ? (
                  <>
                    <Tape rotate={-8} style={{ top: -10, left: 26 }} />
                    <Tape ash rotate={7} style={{ top: -10, right: 26 }} />
                  </>
                ) : null}
              </View>
            </View>
            {footer ? (
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingTop: 20,
                  paddingBottom: Math.max(insets.bottom, 14) + 16,
                  borderTopWidth: 1,
                  borderTopColor: colors.viewerLine,
                  gap: 16,
                }}>
                {footer}
              </View>
            ) : (
              <View style={{ height: insets.bottom + 16 }} />
            )}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

function VideoStage({ url }: { url: string }) {
  const player = useVideoPlayer(url, (video) => {
    video.loop = false;
  });

  return <VideoView player={player} nativeControls style={{ width: '100%', height: '100%' }} contentFit="contain" />;
}
