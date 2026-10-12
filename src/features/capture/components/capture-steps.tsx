import { CachedImage } from '@/components/cached-image';
import { Placeholder, Ticks } from '@/components/ui/decor';
import { ListEnter } from '@/components/ui/enter';
import { CameraIcon } from '@/components/ui/hunt-icons';
import { MediaTile } from '@/components/ui/media-tile';
import { PressScale } from '@/components/ui/press-scale';
import { Body, H2, Mono, Pts } from '@/components/ui/typography';
import type { VisitFile } from '@/features/capture/api';
import { distanceMeters, formatDistance, type Venue } from '@/features/venues/schemas';
import { useSurfaces } from '@/theme/surfaces';
import { Check, Plus, X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

export function StepTitle({ step, title }: { step: string; title: string }) {
  const { colors } = useSurfaces();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
      <Mono size={13} color={colors.accentDeep}>
        {step}
      </Mono>
      <H2 size={24}>{title}</H2>
    </View>
  );
}

type Coords = { lat: number; lng: number };

export function VenueStrip({
  venues,
  selectedId,
  origin,
  onSelect,
}: {
  venues: Venue[];
  selectedId: string | null;
  origin?: Coords | null;
  onSelect: (id: string) => void;
}) {
  return (
    <View accessibilityRole="radiogroup" style={{ gap: 8 }}>
      {venues.map((venue, index) => (
        <ListEnter key={venue.id} index={index}>
          <VenueOption
            venue={venue}
            selected={venue.id === selectedId}
            distance={venue.distance ?? (origin ? distanceMeters(origin, venue) : undefined)}
            onPress={() => onSelect(venue.id)}
          />
        </ListEnter>
      ))}
    </View>
  );
}

function VenueOption({
  venue,
  selected,
  distance,
  onPress,
}: {
  venue: Venue;
  selected: boolean;
  distance?: number;
  onPress: () => void;
}) {
  const { colors, surfaces, isJournal } = useSurfaces();
  const away = distance !== undefined ? `${formatDistance(distance)} away` : null;
  const detail = selected
    ? `${away ?? 'Checking in here'} · +${venue.pointsPerPhoto} a photo`
    : (away ?? venue.address);

  return (
    <PressScale
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${venue.name}, ${detail}`}
      onPress={onPress}
      style={[
        selected ? surfaces.selected : surfaces.soft,
        { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10 },
      ]}>
      {venue.imageUrl ? (
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 6,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: selected ? (isJournal ? colors.ink : colors.line) : colors.lineStrong,
          }}>
          <CachedImage source={{ uri: venue.imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        </View>
      ) : (
        <Placeholder
          radius={6}
          bordered={false}
          style={{ width: 48, height: 48, borderWidth: 1, borderColor: colors.lineStrong }}
        />
      )}
      <View style={{ flex: 1, gap: 2 }}>
        <Body size={16} weight={selected ? 'bold' : 'semibold'} numberOfLines={1}>
          {venue.name}
        </Body>
        <Mono size={12} color={selected ? colors.good : colors.mute} numberOfLines={1}>
          {detail}
        </Mono>
      </View>
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 99,
          alignItems: 'center',
          justifyContent: 'center',
          ...(selected
            ? {
                backgroundColor: colors.accent,
                borderWidth: isJournal ? 1.5 : 1,
                borderColor: isJournal ? colors.ink : colors.line,
              }
            : { borderWidth: 1.5, borderColor: colors.lineStrong }),
        }}>
        {selected ? <Check color={colors.ink} size={14} strokeWidth={3} /> : null}
      </View>
    </PressScale>
  );
}

const corner = (position: ViewStyle): ViewStyle => ({ position: 'absolute', width: 22, height: 22, ...position });

/** Dark viewfinder button with orange crop marks. */
export function ViewfinderButton({ points, onPress }: { points: number; onPress: () => void }) {
  const { colors } = useSurfaces();
  const mark = { borderColor: colors.accent };
  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel="Take a photo"
      accessibilityHint={`Earns ${points} points once approved`}
      onPress={onPress}
      style={{
        height: 190,
        borderRadius: 10,
        backgroundColor: colors.ink,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}>
      <View style={[corner({ top: 14, left: 14 }), mark, { borderTopWidth: 2, borderLeftWidth: 2 }]} />
      <View style={[corner({ top: 14, right: 14 }), mark, { borderTopWidth: 2, borderRightWidth: 2 }]} />
      <View style={[corner({ bottom: 14, left: 14 }), mark, { borderBottomWidth: 2, borderLeftWidth: 2 }]} />
      <View style={[corner({ bottom: 14, right: 14 }), mark, { borderBottomWidth: 2, borderRightWidth: 2 }]} />
      <CameraIcon color={colors.paper} size={34} strokeWidth={1.6} />
      <Body size={17} weight="bold" color={colors.paper}>
        Take a photo
      </Body>
      <Mono size={12} color={colors.viewerMute}>{`+${points} pts each`}</Mono>
    </PressScale>
  );
}

export function ShotTile({
  icon,
  label,
  points,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  points?: number;
  onPress: () => void;
}) {
  const { surfaces } = useSurfaces();
  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel={points !== undefined ? `${label}, plus ${points} points` : label}
      onPress={onPress}
      style={[
        surfaces.soft,
        { flex: 1, height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
      ]}>
      {icon}
      <Body size={15} weight="semibold">
        {label}
      </Body>
      {points !== undefined ? <Pts>{`+${points}`}</Pts> : null}
    </PressScale>
  );
}

export function PickedShots({
  files,
  estimate,
  onRemove,
  onAdd,
}: {
  files: VisitFile[];
  estimate: number;
  onRemove: (uri: string) => void;
  onAdd: () => void;
}) {
  const { colors } = useSurfaces();
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Mono size={12}>{`${files.length} ${files.length === 1 ? 'shot' : 'shots'} picked`}</Mono>
        <Pts>{`up to +${estimate} pts`}</Pts>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {files.map((file) => (
          <View key={file.uri}>
            <MediaTile uri={file.uri} kind={file.type} size={76} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remove shot"
              hitSlop={8}
              onPress={() => onRemove(file.uri)}
              style={{
                position: 'absolute',
                right: -6,
                top: -6,
                width: 24,
                height: 24,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.ink,
              }}>
              <X color={colors.paper} size={13} strokeWidth={2.4} />
            </Pressable>
          </View>
        ))}
        <PressScale
          accessibilityRole="button"
          accessibilityLabel="Add more shots"
          onPress={onAdd}
          style={{
            width: 76,
            height: 76,
            borderRadius: 6,
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: colors.lineStrong,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Plus color={colors.ink} size={20} />
        </PressScale>
      </View>
    </View>
  );
}

export function ProgressCard({ ratio }: { ratio: number }) {
  const { surfaces } = useSurfaces();
  const percent = Math.round(ratio * 100);
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityLabel={`Uploading, ${percent} percent`}
      style={[surfaces.soft, { padding: 16, gap: 10 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Body size={15} weight="semibold">
          Sending your shots
        </Body>
        <Mono size={13}>{`${percent}%`}</Mono>
      </View>
      <Ticks progress={ratio} />
    </View>
  );
}
