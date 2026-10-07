import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MediaTile } from '@/components/ui/media-tile';
import { PointsPill } from '@/components/ui/points-pill';
import type { OwnerSubmission, OwnerVenue } from '@/features/owner/schemas';
import { useHauntColors } from '@/theme/colors';
import { hapticSuccess } from '@/components/ui/press';
import { Camera, Check, Video } from 'lucide-react-native';
import { useEffect } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

function timeAgo(iso: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function ReviewCard({
  item,
  venue,
  busy,
  leaving,
  onOpen,
  onApprove,
  onReject,
}: {
  item: OwnerSubmission;
  venue?: OwnerVenue;
  busy: boolean;
  leaving: boolean;
  onOpen: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const colors = useHauntColors();
  const { width } = useWindowDimensions();
  const mediaWidth = width - 48;
  const progress = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ translateX: progress.value * 56 }, { scale: 1 - progress.value * 0.04 }],
  }));
  const guest = item.user.username || item.user.email;
  const award =
    item.pointsAwarded ??
    (item.type === 'VIDEO' ? venue?.pointsPerVideo : venue?.pointsPerPhoto);
  const TypeIcon = item.type === 'VIDEO' ? Video : Camera;

  useEffect(() => {
    progress.value = leaving ? withTiming(1, { duration: 280 }) : 0;
  }, [leaving, progress]);

  const approve = () => {
    hapticSuccess();
    onApprove();
  };

  return (
    <Animated.View className="mx-6 mb-4 overflow-hidden rounded-3xl bg-haunt-card shadow-card" style={style}>
      <MediaTile uri={item.mediaUrl} kind={item.type} width={mediaWidth} height={mediaWidth * 0.75} onPress={onOpen} />
      <View className="p-4">
        <View className="flex-row items-center">
          <Avatar name={guest} size={40} />
          <View className="ml-3 flex-1">
            <Text className="font-sans-semibold text-body text-haunt-ink" numberOfLines={1}>
              {guest}
            </Text>
            <Text className="mt-0.5 font-sans text-caption text-haunt-mute" numberOfLines={1}>
              {item.venue.name} · {timeAgo(item.createdAt)}
            </Text>
          </View>
          <TypeIcon color={colors.mute} size={18} />
          {award != null ? (
            <View className="ml-2">
              <PointsPill value={`+${award}`} />
            </View>
          ) : null}
        </View>
        {item.rejectionReason ? (
          <Text className="mt-3 font-sans text-caption text-haunt-danger">{item.rejectionReason}</Text>
        ) : null}
        {item.status === 'PENDING' ? (
          <View className="mt-4 flex-row gap-3">
            <Button className="flex-1" size="md" variant="danger" label="Reject" onPress={onReject} disabled={busy || leaving} />
            <Button
              className="flex-1"
              size="md"
              label="Approve"
              leftIcon={<Check color={colors.onAccent} size={18} />}
              onPress={approve}
              loading={busy}
              disabled={leaving}
            />
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}
