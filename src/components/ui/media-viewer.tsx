import { CachedImage } from '@/components/cached-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { X } from 'lucide-react-native';
import { useEffect } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MediaViewerProps = {
  url: string | null;
  kind: 'PHOTO' | 'VIDEO' | null;
  onClose: () => void;
};

export function MediaViewer({ url, kind, onClose }: MediaViewerProps) {
  const insets = useSafeAreaInsets();
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
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[{ flex: 1, backgroundColor: '#161210', paddingTop: insets.top + 8 }, sheet]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              className="ml-4 h-11 w-11 items-center justify-center rounded-full bg-white/10">
              <X color="#FFFCF8" size={20} />
            </Pressable>
            <View className="flex-1 justify-center px-4" style={{ paddingBottom: insets.bottom + 16 }}>
              {kind === 'PHOTO' && url ? (
                <CachedImage source={{ uri: url }} style={{ width: '100%', height: '80%' }} contentFit="contain" />
              ) : null}
              {kind === 'VIDEO' && url ? <VideoStage url={url} /> : null}
            </View>
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

  return <VideoView player={player} nativeControls style={{ width: '100%', height: '80%' }} contentFit="contain" />;
}
