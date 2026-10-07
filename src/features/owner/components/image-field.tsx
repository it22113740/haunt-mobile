import { CachedImage } from '@/components/cached-image';
import { MediaViewer } from '@/components/ui/media-viewer';
import { hapticWarning } from '@/components/ui/press';
import { uploadImage } from '@/features/owner/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { useHauntColors } from '@/theme/colors';
import * as ImagePicker from 'expo-image-picker';
import { ImagePlus } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type ImageFieldProps = {
  url: string;
  onChange: (url: string) => void;
};

export function ImageField({ url, onChange }: ImageFieldProps) {
  const colors = useHauntColors();
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
    <View>
      {url ? (
        <View className="overflow-hidden rounded-3xl">
          <Pressable accessibilityRole="button" accessibilityLabel="View photo" onPress={() => setViewing(true)}>
            <CachedImage source={{ uri: url }} style={{ width: '100%', aspectRatio: 16 / 9 }} contentFit="cover" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change photo"
            onPress={() => void pick()}
            className="absolute bottom-3 right-3 rounded-full bg-haunt-card px-4 py-2">
            <Text className="font-sans-semibold text-caption text-haunt-ink">Change</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add a cover photo"
          onPress={() => void pick()}
          className="aspect-video items-center justify-center rounded-3xl border border-dashed border-haunt-line bg-haunt-paper">
          <ImagePlus color={colors.accent} size={28} />
          <Text className="mt-2 font-sans-semibold text-body text-haunt-ink">Add a cover photo</Text>
        </Pressable>
      )}
      {uploading ? (
        <View className="absolute inset-0 items-center justify-center rounded-3xl bg-black/30">
          <ActivityIndicator color={colors.onAccent} />
        </View>
      ) : null}
      {error ? <Text className="mt-2 font-sans text-caption text-haunt-danger">{error}</Text> : null}
      <MediaViewer url={viewing ? url : null} kind={viewing && url ? 'PHOTO' : null} onClose={() => setViewing(false)} />
    </View>
  );
}
