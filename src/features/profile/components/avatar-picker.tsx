import { Avatar } from '@/components/ui/avatar';
import { Stamp } from '@/components/ui/decor';
import { CameraIcon } from '@/components/ui/hunt-icons';
import { Body, H1 } from '@/components/ui/typography';
import { useUploadAvatar } from '@/features/profile/hooks';
import type { Profile } from '@/features/profile/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useSurfaces } from '@/theme/surfaces';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

type AvatarPickerProps = {
  profile: Profile;
};

export function AvatarPicker({ profile }: AvatarPickerProps) {
  const upload = useUploadAvatar();
  const { colors, surfaces } = useSurfaces();
  const [error, setError] = useState<string | null>(null);
  const name = profile.username || profile.email;
  const displayName = profile.username ? profile.username.charAt(0).toUpperCase() + profile.username.slice(1) : name;

  const onPick = async () => {
    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Allow photo access to update your picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    try {
      await upload.mutateAsync({
        uri: asset.uri,
        name: asset.fileName ?? 'avatar.jpg',
        type: asset.mimeType ?? 'image/jpeg',
      });
    } catch (pickError) {
      setError(getApiErrorMessage(pickError, 'Could not update your photo.'));
    }
  };

  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
          accessibilityState={{ busy: upload.isPending }}
          disabled={upload.isPending}
          onPress={() => {
            void onPick();
          }}
          style={{ width: 84, height: 84 }}>
          <Avatar imageUrl={profile.imageUrl} name={name} size={84} />
          <View
            style={[
              surfaces.iconButton,
              {
                position: 'absolute',
                right: -4,
                bottom: -4,
                width: 34,
                height: 34,
                borderRadius: 17,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.accent,
              },
            ]}>
            {upload.isPending ? (
              <ActivityIndicator size="small" color={colors.ink} />
            ) : (
              <CameraIcon color={colors.ink} size={16} strokeWidth={2} />
            )}
          </View>
        </Pressable>
        <View style={{ flex: 1, gap: 6, alignItems: 'flex-start' }}>
          <H1 size={28} numberOfLines={1}>
            {displayName}
          </H1>
          <Stamp label={profile.role === 'OWNER' ? 'Business' : 'Explorer'} tone="wait" />
        </View>
      </View>
      {error ? (
        <Body size={14} color={colors.danger}>
          {error}
        </Body>
      ) : null}
    </View>
  );
}
