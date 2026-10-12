import { ScreenState } from '@/components/screen-state';
import { Button } from '@/components/ui/button';
import { Doodle } from '@/components/ui/decor';
import { ScreenEnter } from '@/components/ui/enter';
import { LibraryIcon, VideoIcon } from '@/components/ui/hunt-icons';
import { hapticSuccess, hapticWarning } from '@/components/ui/press';
import { useTabBarInset } from '@/components/ui/tab-bar';
import { Body, Label, Sub, Wordmark } from '@/components/ui/typography';
import type { VisitFile } from '@/features/capture/api';
import { CaptureSuccess } from '@/features/capture/components/capture-success';
import {
  PickedShots,
  ProgressCard,
  ShotTile,
  StepTitle,
  VenueStrip,
  ViewfinderButton,
} from '@/features/capture/components/capture-steps';
import { useSubmitVisit } from '@/features/capture/hooks';
import { useExploreVenues, useUserLocation } from '@/features/venues/hooks';
import { getApiErrorMessage } from '@/lib/api-error';
import { useHauntColors } from '@/theme/colors';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CaptureScreen() {
  const insets = useSafeAreaInsets();
  const tabInset = useTabBarInset();
  const router = useRouter();
  const colors = useHauntColors();
  const explore = useExploreVenues(true);
  const location = useUserLocation();
  const submit = useSubmitVisit();
  const params = useLocalSearchParams<{ venueId?: string | string[] }>();
  const paramVenueId = (Array.isArray(params.venueId) ? params.venueId[0] : params.venueId) ?? null;
  const [venueId, setVenueId] = useState<string | null>(paramVenueId);
  const [lastParamVenueId, setLastParamVenueId] = useState(paramVenueId);
  const [files, setFiles] = useState<VisitFile[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<{ points: number } | null>(null);

  if (paramVenueId !== lastParamVenueId) {
    setLastParamVenueId(paramVenueId);
    if (paramVenueId) setVenueId(paramVenueId);
  }

  const venue = explore.venues.find((item) => item.id === venueId) ?? null;
  const estimate = venue
    ? files.reduce((sum, file) => sum + (file.type === 'VIDEO' ? venue.pointsPerVideo : venue.pointsPerPhoto), 0)
    : 0;
  const photoPoints = venue?.pointsPerPhoto ?? explore.venues[0]?.pointsPerPhoto ?? 10;
  const videoPoints = venue?.pointsPerVideo ?? explore.venues[0]?.pointsPerVideo ?? 20;

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

  const ready = Boolean(venueId) && files.length > 0;
  const hint = !venueId
    ? 'Pick the place you’re at first.'
    : files.length === 0
      ? 'Add at least one shot first.'
      : `You’ll earn up to +${estimate} pts once approved.`;

  const footerBottom = tabInset - 2;
  const quiet = files.length === 0 && progress === null && !error;

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top }}>
      {quiet ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: footerBottom }}>
          <Doodle kind="trail" size={180} style={{ left: 28, bottom: 48 }} />
          <Doodle kind="camera" size={40} rotate={10} style={{ right: 34, bottom: 102 }} />
        </View>
      ) : null}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: 24, gap: 22 }}
        keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark />
          <Label>New entry</Label>
        </View>

        <View style={{ gap: 12 }}>
          <StepTitle step="01" title="Where are you?" />
          {explore.venues.length === 0 ? (
            <Sub>No places on Haunt yet. Check back once a venue joins.</Sub>
          ) : (
            <VenueStrip
              venues={explore.venues}
              selectedId={venueId}
              origin={location.data}
              onSelect={setVenueId}
            />
          )}
        </View>

        <View style={{ gap: 12 }}>
          <Doodle kind="arrow" size={66} style={{ right: -4, top: -21 }} />
          <Doodle kind="sparkle" size={14} accent style={{ right: 76, top: 17 }} />
          <StepTitle step="02" title="Grab your shots" />
          <ViewfinderButton points={photoPoints} onPress={() => void capture('images')} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ShotTile
              icon={<VideoIcon color={colors.ink} size={20} />}
              label="Video"
              points={videoPoints}
              onPress={() => void capture('videos')}
            />
            <ShotTile
              icon={<LibraryIcon color={colors.ink} size={20} />}
              label="From library"
              onPress={() => void pickLibrary()}
            />
          </View>
        </View>

        {files.length > 0 ? (
          <PickedShots
            files={files}
            estimate={estimate}
            onAdd={() => void pickLibrary()}
            onRemove={(uri) => setFiles((current) => current.filter((item) => item.uri !== uri))}
          />
        ) : null}
        {progress !== null ? <ProgressCard ratio={progress} /> : null}
        {error ? (
          <Body size={14} color={colors.danger} accessibilityLiveRegion="polite">
            {error}
          </Body>
        ) : null}
      </ScrollView>
      <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: footerBottom, gap: 8, alignItems: 'center' }}>
        <Button
          label="Send for review"
          className="self-stretch"
          onPress={() => void onSubmit()}
          loading={submit.isPending}
          disabled={!ready}
        />
        <Body size={13} color={colors.mute} style={{ textAlign: 'center' }}>
          {hint}
        </Body>
      </View>
    </ScreenEnter>
  );
}
