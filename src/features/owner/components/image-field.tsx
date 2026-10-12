import { PressScale } from '@/components/ui/press-scale';
import { CachedImage } from '@/components/cached-image';
import { ImageIcon } from '@/components/ui/hunt-icons';
import { MediaViewer } from '@/components/ui/media-viewer';
import { hapticWarning } from '@/components/ui/press';
import { Body } from '@/components/ui/typography';
import { uploadImage } from '@/features/owner/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { useSurfaces } from '@/theme/surfaces';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type ImageFieldProps = {
  url: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  height?: number;
};

export function ImageField({
  url,
  onChange,
  label = 'Add a cover photo',
  hint = 'Your front door works best. It’s what guests look for.',
  height = 170,
}: ImageFieldProps) {
  const { colors, surfaces } = useSurfaces();
  const [uploading, setUploading] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async () => {
    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      hapticWarning();
      setError('Allow photo access to add a picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    const asset = result.assets?.[0];
    if (result.canceled || !asset) return;
    setUploading(true);
    try {
      const mediaUrl = await uploadImage({
        uri: asset.uri,
        name: asset.fileName ?? 'photo.jpg',
        type: asset.mimeType ?? 'image/jpeg',
      });
      onChange(mediaUrl);
    } catch (uploadError) {
      hapticWarning();
      setError(getApiErrorMessage(uploadError, 'Could not upload that photo.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ gap: 8 }}>
      <View>
        {url ? (
          <View style={[surfaces.image, { height, borderRadius: 10, overflow: 'hidden' }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View photo"
              onPress={() => setViewing(true)}
              style={{ flex: 1 }}>
              <CachedImage source={{ uri: url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            </Pressable>
            <PressScale
              accessibilityRole="button"
              accessibilityLabel="Change photo"
              onPress={() => void pick()}
              style={[
                surfaces.iconButton,
                {
                  position: 'absolute',
                  right: 12,
                  bottom: 12,
                  height: 36,
                  paddingHorizontal: 14,
                  borderRadius: 99,
                  justifyContent: 'center',
                },
              ]}>
              <Text style={{ fontFamily: 'BricolageGrotesque_600SemiBold', fontSize: 14, color: colors.ink }}>Change</Text>
            </PressScale>
          </View>
        ) : (
          <PressScale
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityHint={hint}
            onPress={() => void pick()}
            style={[
              surfaces.dashed,
              {
                height,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingHorizontal: 24,
              },
            ]}>
            <ImageIcon color={colors.accentDeep} size={28} strokeWidth={1.6} />
            <Body size={16} weight="bold">
              {label}
            </Body>
            <Body size={13} color={colors.mute} style={{ textAlign: 'center' }}>
              {hint}
            </Body>
          </PressScale>
        )}
        {uploading ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.scrim,
            }}>
            <ActivityIndicator color={colors.card} />
          </View>
        ) : null}
      </View>
      {error ? (
        <Body size={13} color={colors.danger}>
          {error}
        </Body>
      ) : null}
      <MediaViewer url={viewing ? url : null} kind={viewing && url ? 'PHOTO' : null} onClose={() => setViewing(false)} />
    </View>
  );
}
