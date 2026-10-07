import { CachedImage } from '@/components/cached-image';
import { useUploadAvatar } from '@/features/profile/hooks';
import type { Profile } from '@/features/profile/schemas';
import { getApiErrorMessage } from '@/lib/api-error';
import { useHauntColors } from '@/theme/colors';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type AvatarPickerProps = {
  profile: Profile;
};

export function AvatarPicker({ profile }: AvatarPickerProps) {
  const upload = useUploadAvatar();
  const colors = useHauntColors();
  const [error, setError] = useState<string | null>(null);
  const initial = (profile.username || profile.email).slice(0, 1).toUpperCase();

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
    <View className="items-center">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Change profile photo"
        onPress={() => {
          void onPick();
        }}
        className="h-24 w-24 items-center justify-center">
        {profile.imageUrl ? (
          <CachedImage
            source={{ uri: profile.imageUrl }}
            style={{ width: 96, height: 96, borderRadius: 48 }}
            contentFit="cover"
          />
        ) : (
          <View className="h-24 w-24 items-center justify-center rounded-full bg-haunt-blush">
            <Text className="text-3xl font-semibold text-haunt-accent">{initial}</Text>
          </View>
        )}
        <View className="absolute bottom-0 right-0 h-11 w-11 items-center justify-center rounded-full bg-haunt-ink">
          {upload.isPending ? (
            <ActivityIndicator color={colors.card} />
          ) : (
            <Camera color={colors.card} size={18} />
          )}
        </View>
      </Pressable>
      {error ? <Text className="mt-3 text-center text-sm text-haunt-danger">{error}</Text> : null}
    </View>
  );
}
