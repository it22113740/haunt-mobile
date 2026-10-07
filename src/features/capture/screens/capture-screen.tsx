import { EmptyState } from '@/components/empty-state';
import { ScreenState } from '@/components/screen-state';
import { Button } from '@/components/ui/button';
import { MediaTile } from '@/components/ui/media-tile';
import { ScreenEnter } from '@/components/ui/enter';
import { hapticSuccess, hapticWarning } from '@/components/ui/press';
import { AppHeader } from '@/components/ui/screen-header';
import { useTabBarInset } from '@/components/ui/tab-bar';
import type { VisitFile } from '@/features/capture/api';
import { CaptureSuccess } from '@/features/capture/components/capture-success';
import { ProgressCard, ShotTile, VenueStrip } from '@/features/capture/components/capture-steps';
import { useSubmitVisit } from '@/features/capture/hooks';
import { useExploreVenues } from '@/features/venues/hooks';
import { getApiErrorMessage } from '@/lib/api-error';
import { useHauntColors } from '@/theme/colors';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera, Images, Plus, Video, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CaptureScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const router = useRouter();
  const colors = useHauntColors();
  const explore = useExploreVenues(true);
  const submit = useSubmitVisit();
  const [venueId, setVenueId] = useState<string | null>(null);
  const [files, setFiles] = useState<VisitFile[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<{ points: number } | null>(null);
  const params = useLocalSearchParams<{ venueId?: string | string[] }>();

  useEffect(() => {
    const raw = Array.isArray(params.venueId) ? params.venueId[0] : params.venueId;
    if (raw) setVenueId(raw);
  }, [params.venueId]);

  const venue = explore.venues.find((item) => item.id === venueId) ?? null;
  const estimate = venue
    ? files.reduce((sum, file) => sum + (file.type === 'VIDEO' ? venue.pointsPerVideo : venue.pointsPerPhoto), 0)
    : 0;

  const addAssets = (assets: ImagePicker.ImagePickerAsset[]) => {
    setSent(null);
    setFiles((current) => [
      ...current,
      ...assets.map((asset) => {
        const video = asset.type === 'video' || asset.mimeType?.startsWith('video');
        return {
          uri: asset.uri,
          name: asset.fileName ?? (video ? 'visit.mp4' : 'visit.jpg'),
          mime: asset.mimeType ?? (video ? 'video/mp4' : 'image/jpeg'),
          type: video ? ('VIDEO' as const) : ('PHOTO' as const),
        };
      }),
    ]);
  };

  const pickLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      hapticWarning();
      setError('Allow photo access to choose a visit.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) addAssets(result.assets);
  };

  const capture = async (kind: 'images' | 'videos') => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      hapticWarning();
      setError('Allow camera access to record a visit.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: [kind], quality: 0.8 });
    if (!result.canceled) addAssets(result.assets);
  };

  const onSubmit = async () => {
    if (!venueId || files.length === 0) return;
    setError(null);
    setProgress(0);
    try {
      await submit.mutateAsync({ venueId, files, onProgress: setProgress });
      hapticSuccess();
      setSent({ points: estimate });
      setFiles([]);
      setProgress(null);
    } catch (submitError) {
      setProgress(null);
      setError(getApiErrorMessage(submitError, 'Could not send this visit.'));
    }
  };

  if (explore.isPending) return <ScreenState loading title="Loading venues" />;
  if (explore.isError) {
    return (
      <ScreenState
        title="Couldn’t load venues"
        detail="Pick a place after the list loads."
        action="Try again"
        onPress={() => void explore.refetch()}
      />
    );
  }

  if (sent) {
    return (
      <CaptureSuccess
        points={sent.points}
        onActivity={() => router.push('/(user)/(tabs)/activity')}
        onAgain={() => setSent(null)}
      />
    );
  }

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top + 8 }}>
      <AppHeader />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled">
        <Text className="px-6 font-sans-semibold text-caption text-haunt-accent">1</Text>
        <Text className="mt-1 px-6 font-display text-title text-haunt-ink">Where are you?</Text>
        {explore.venues.length === 0 ? (
          <EmptyState illustration="empty-places" title="No venues yet" detail="No venues to visit yet." />
        ) : (
          <VenueStrip venues={explore.venues} selectedId={venueId} onSelect={setVenueId} />
        )}
        <Text className="mt-8 px-6 font-sans-semibold text-caption text-haunt-accent">2</Text>
        <Text className="mt-1 px-6 font-display text-title text-haunt-ink">Add your shots</Text>
        <View className="mt-4 flex-row gap-3 px-6">
          <ShotTile icon={<Camera color={colors.accent} size={22} />} label="Camera" onPress={() => void capture('images')} />
          <ShotTile icon={<Video color={colors.accent} size={22} />} label="Video" onPress={() => void capture('videos')} />
          <ShotTile icon={<Images color={colors.accent} size={22} />} label="Images" onPress={() => void pickLibrary()} />
        </View>
        {files.length > 0 ? (
          <View className="mt-4 px-6">
            <Text className="font-sans text-caption text-haunt-mute">
              {files.length} {files.length === 1 ? 'item' : 'items'} · up to +{estimate} pts
            </Text>
            <View className="mt-3 flex-row flex-wrap gap-3">
              {files.map((file) => (
                <View key={file.uri}>
                  <MediaTile uri={file.uri} kind={file.type} size={100} />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Remove"
                    onPress={() => setFiles((current) => current.filter((item) => item.uri !== file.uri))}
                    className="absolute -right-1 -top-1 h-7 w-7 items-center justify-center rounded-full bg-haunt-ink">
                    <X color={colors.card} size={14} />
                  </Pressable>
                </View>
              ))}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add more"
                onPress={() => void pickLibrary()}
                className="h-[100px] w-[100px] items-center justify-center rounded-2xl border border-dashed border-haunt-line">
                <Plus color={colors.ink} size={22} />
              </Pressable>
            </View>
          </View>
        ) : null}
        {progress !== null ? <ProgressCard ratio={progress} /> : null}
        {error ? <Text className="mt-3 px-6 font-sans text-caption text-haunt-danger">{error}</Text> : null}
      </ScrollView>
      <View className="px-6 pt-3" style={{ paddingBottom: tabInset }}>
        <Button
          label="Submit visit"
          onPress={() => void onSubmit()}
          loading={submit.isPending}
          disabled={!venueId || files.length === 0}
        />
      </View>
    </ScreenEnter>
  );
}
