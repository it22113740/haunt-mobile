import { MotionView } from '@/components/ui/animated';
import { PressScale } from '@/components/ui/press-scale';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Stamp, Tape } from '@/components/ui/decor';
import { MediaTile } from '@/components/ui/media-tile';
import { hapticSuccess } from '@/components/ui/press';
import { Body, Hand, Mono, Pts } from '@/components/ui/typography';
import type { OwnerSubmission, OwnerVenue } from '@/features/owner/schemas';
import { useSurfaces } from '@/theme/surfaces';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View, useWindowDimensions } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export function timeAgo(iso: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} d ago`;
}

export function awardFor(item: OwnerSubmission, venue?: OwnerVenue) {
  return item.pointsAwarded ?? (item.type === 'VIDEO' ? venue?.pointsPerVideo : venue?.pointsPerPhoto);
}

const SCREEN_GUTTER = 40;

export function ReviewCard({
  item,
  venue,
  busy,
  leaving,
  taped = false,
  onOpen,
  onApprove,
  onReject,
}: {
  item: OwnerSubmission;
  venue?: OwnerVenue;
  busy: boolean;
  leaving: boolean;
  taped?: boolean;
  onOpen: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const { colors, isJournal } = useSurfaces();
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ translateX: progress.value * 56 }, { scale: 1 - progress.value * 0.04 }],
  }));
  const guest = item.user.username || item.user.email;
  const award = awardFor(item, venue);
  const pending = item.status === 'PENDING';
  const border = isJournal ? 1.5 : 1;
  const mediaWidth = width - SCREEN_GUTTER - border * 2;

  useEffect(() => {
    progress.value = leaving ? withTiming(1, { duration: 280 }) : 0;
  }, [leaving, progress]);

  const approve = () => {
    hapticSuccess();
    onApprove();
  };

  return (
    <MotionView style={style}>
      <Card tone={pending ? 'card' : 'soft'}>
        <View
          style={{
            borderBottomWidth: pending ? border : 1,
            borderBottomColor: pending && isJournal ? colors.ink : colors.line,
          }}>
          <MediaTile
            uri={item.mediaUrl}
            kind={item.type}
            width={mediaWidth}
            height={pending ? 250 : 200}
            radius={0}
            bordered={false}
            onPress={onOpen}
          />
          {!pending ? (
            <View style={{ position: 'absolute', top: 14, right: 14 }} pointerEvents="none">
              <Stamp
                label={item.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                tone={item.status === 'APPROVED' ? 'ok' : 'no'}
                rotate={4}
                background={colors.card}
              />
            </View>
          ) : null}
        </View>
        <View style={{ paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar name={guest} size={36} />
          <View style={{ flex: 1, gap: 2 }}>
            <Body size={16} weight="bold" numberOfLines={1}>
              {guest}
            </Body>
            <Mono size={12} numberOfLines={1}>{`${item.venue.name} · ${timeAgo(item.createdAt)}`}</Mono>
          </View>
          {pending && award != null ? <Pts size={15}>{`+${award}`}</Pts> : null}
          {item.status === 'APPROVED' && award != null ? (
            <Mono size={14} color={colors.good}>{`+${award} given`}</Mono>
          ) : null}
        </View>
        {item.status === 'REJECTED' && item.rejectionReason ? (
          <Hand size={19} color={colors.danger} style={{ paddingHorizontal: 16, marginTop: -6, paddingBottom: 14 }}>
            {`“${item.rejectionReason}”`}
          </Hand>
        ) : null}
        {pending ? (
          <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingBottom: 16 }}>
            <Button
              className="flex-1"
              size="sm"
              variant="secondary"
              label="Reject"
              onPress={onReject}
              disabled={busy || leaving}
            />
            <Button className="flex-1" size="sm" label="Approve" onPress={approve} loading={busy} disabled={leaving} />
          </View>
        ) : null}
      </Card>
      {taped ? <Tape rotate={6} style={{ top: -10, right: 30 }} /> : null}
    </MotionView>
  );
}

/** Guest, place and review actions pinned under the full-screen viewer. */
export function ReviewViewerFooter({
  item,
  venue,
  busy,
  onApprove,
  onReject,
}: {
  item: OwnerSubmission;
  venue?: OwnerVenue;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const { colors } = useSurfaces();
  const guest = item.user.username || item.user.email;
  const award = awardFor(item, venue);
  const kind = item.type === 'VIDEO' ? 'Video' : 'Photo';

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Avatar name={guest} size={40} accent />
        <View style={{ flex: 1, gap: 2 }}>
          <Body size={16} weight="bold" color={colors.viewerText} numberOfLines={1}>
            {guest}
          </Body>
          <Mono size={12} color={colors.viewerMute} numberOfLines={1}>
            {`${item.venue.name} · ${kind} · ${timeAgo(item.createdAt)}`}
          </Mono>
        </View>
        {award != null ? (
          <Mono size={15} color={colors.accent}>
            {item.status === 'APPROVED' ? `+${award} given` : `+${award}`}
          </Mono>
        ) : null}
      </View>
      {item.status === 'PENDING' ? (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <ViewerAction label="Reject" onPress={onReject} disabled={busy} />
          <ViewerAction
            label="Approve"
            primary
            busy={busy}
            onPress={() => {
              hapticSuccess();
              onApprove();
            }}
          />
        </View>
      ) : null}
    </>
  );
}

function ViewerAction({
  label,
  onPress,
  primary = false,
  busy = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
  busy?: boolean;
  disabled?: boolean;
}) {
  const { colors } = useSurfaces();
  const textColor = primary ? colors.onAccent : colors.viewerText;
  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || busy, busy }}
      disabled={disabled || busy}
      onPress={onPress}
      style={{
        flex: 1,
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: primary ? colors.accent : 'transparent',
        borderWidth: primary ? 0 : 1.5,
        borderColor: colors.viewerBorder,
        opacity: disabled ? 0.7 : 1,
      }}>
      {busy ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={{ fontFamily: 'BricolageGrotesque_700Bold', fontSize: 16, color: textColor }}>{label}</Text>
      )}
    </PressScale>
  );
}
