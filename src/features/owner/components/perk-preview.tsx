import { CachedImage } from '@/components/cached-image';
import { Card } from '@/components/ui/card';
import { DashRule, Placeholder } from '@/components/ui/decor';
import { GlassIcon } from '@/components/ui/hunt-icons';
import { Body } from '@/components/ui/typography';
import type { PerkFormValues } from '@/features/owner/schemas';
import { useSurfaces } from '@/theme/surfaces';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

export const perkTypeLabel = {
  DISCOUNT: 'Discount',
  FREE_MEAL: 'Free meal',
  OTHER: 'Gift',
} as const;

type PerkStat = {
  key: string;
  value: string | number;
  label: string;
  tone?: 'accent' | 'good';
};

/** Perk card: 64px thumb, title, `Venue · Type`, and a dashed mono stats row. */
export function PerkCard({
  title,
  subtitle,
  imageUrl,
  stats,
  right,
  onPress,
  accessibilityLabel,
}: {
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  stats: PerkStat[];
  right?: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const { colors, surfaces, isJournal } = useSurfaces();

  return (
    <View>
      <Card onPress={onPress} accessibilityLabel={accessibilityLabel}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            padding: 14,
            paddingRight: right ? 64 : 14,
          }}>
          <View style={[surfaces.image, { width: 64, height: 64, borderRadius: 8, overflow: 'hidden' }]}>
            {imageUrl ? (
              <CachedImage source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            ) : (
              <Placeholder style={{ flex: 1 }} radius={0} bordered={false}>
                <GlassIcon color={colors.ink} size={26} strokeWidth={1.6} />
              </Placeholder>
            )}
          </View>
          <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
            <Body size={18} weight="bold" numberOfLines={2}>
              {title}
            </Body>
            <Body size={14} color={colors.mute} numberOfLines={1}>
              {subtitle}
            </Body>
          </View>
        </View>
        <DashRule color={colors.lineStrong} width={isJournal ? 1.5 : 1} />
        <View style={{ flexDirection: 'row' }}>
          {stats.map((stat, index) => (
            <View
              key={stat.key}
              style={{
                flex: 1,
                gap: 2,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderLeftWidth: index === 0 ? 0 : 1,
                borderLeftColor: colors.line,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'IBMPlexMono_500Medium',
                  fontSize: 16,
                  color: stat.tone === 'accent' ? colors.accentDeep : stat.tone === 'good' ? colors.good : colors.ink,
                }}>
                {stat.value}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'IBMPlexMono_400Regular',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  color: colors.mute,
                }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </Card>
      {right ? <View style={{ position: 'absolute', top: 14, right: 14 }}>{right}</View> : null}
    </View>
  );
}

export function PerkPreview({
  values,
  venueName,
}: {
  values: Pick<PerkFormValues, 'title' | 'type' | 'pointsRequired' | 'discountPercent' | 'imageUrl'>;
  venueName?: string;
}) {
  const title = values.title.trim() || 'Perk title';
  const discount = values.type === 'DISCOUNT' && values.discountPercent > 0;
  return (
    <PerkCard
      title={title}
      subtitle={`${venueName || 'Your place'} · ${perkTypeLabel[values.type]}`}
      imageUrl={values.imageUrl || null}
      stats={[
        {
          key: 'points',
          value: values.pointsRequired || 0,
          label: 'Points',
          tone: 'accent',
        },
        discount
          ? { key: 'off', value: `${values.discountPercent}%`, label: 'Off' }
          : { key: 'claimed', value: 0, label: 'Claimed' },
        { key: 'status', value: 'Preview', label: 'Status' },
      ]}
    />
  );
}
