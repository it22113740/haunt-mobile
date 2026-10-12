import { useMemo } from 'react';
import type { ViewStyle } from 'react-native';
import { useHuntTheme, type HuntColors } from '@/theme/colors';
import type { HuntVariant } from '@/theme/tokens';

export type HuntSurfaces = ReturnType<typeof buildSurfaces>;

function buildSurfaces(variant: HuntVariant, colors: HuntColors) {
  const journal = variant === 'journal';
  const hardShadow = (offset: number): ViewStyle => ({ boxShadow: `0px ${offset}px 0px ${colors.ink}` });
  const liftShadow: ViewStyle = { boxShadow: '0px 8px 24px -10px rgba(24,24,26,0.18)' };

  const card: ViewStyle = journal
    ? { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.ink, borderRadius: 10 }
    : { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 14 };

  const soft: ViewStyle = {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: journal ? 10 : 12,
  };

  return {
    card,
    soft,
    /** Hero card that sits above the page (wallet balance, offers, pending review). */
    raised: { ...card, ...(journal ? hardShadow(4) : liftShadow) } as ViewStyle,
    /** A selected option card (capture venue). */
    selected: { ...card, ...(journal ? hardShadow(3) : liftShadow) } as ViewStyle,
    boxInput: {
      backgroundColor: colors.card,
      borderWidth: journal ? 1.5 : 1,
      borderColor: journal ? colors.ink : colors.line,
      borderRadius: 10,
    } as ViewStyle,
    dashed: {
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.lineStrong,
      borderRadius: journal ? 10 : 12,
    } as ViewStyle,
    image: {
      borderWidth: journal ? 1.5 : 1,
      borderColor: journal ? colors.ink : colors.line,
    } as ViewStyle,
    iconButton: journal
      ? ({ backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.ink } as ViewStyle)
      : ({
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.line,
          boxShadow: '0px 2px 10px rgba(24,24,26,0.10)',
        } as ViewStyle),
    avatar: journal
      ? ({ backgroundColor: colors.blush, borderWidth: 1.5, borderColor: colors.ink } as ViewStyle)
      : ({ backgroundColor: colors.placeholder, borderWidth: 1, borderColor: colors.lineStrong } as ViewStyle),
    /** Strong rule used by stat strips and the tab bar. */
    strongRule: { width: journal ? 1.5 : 1, color: journal ? colors.ink : colors.line },
    hardShadow,
    liftShadow,
  };
}

export function useSurfaces() {
  const { variant, colors, isJournal, isWhite } = useHuntTheme();
  const surfaces = useMemo(() => buildSurfaces(variant, colors), [variant, colors]);
  return { variant, colors, isJournal, isWhite, surfaces };
}
