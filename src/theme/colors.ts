import { vars } from 'nativewind';
import { useColorScheme } from 'react-native';
import { huntTokens, type HuntVariant } from '@/theme/tokens';

export type HuntColors = { [Key in keyof typeof huntTokens.journal]: string };

export const huntJournal: HuntColors = huntTokens.journal;
export const huntWhite: HuntColors = huntTokens.white;

function channels(hex: string) {
  const value = hex.replace('#', '');
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `${red} ${green} ${blue}`;
}

export function huntCssVariables(colors: HuntColors) {
  return {
    '--hunt-paper': channels(colors.paper),
    '--hunt-ink': channels(colors.ink),
    '--hunt-mute': channels(colors.mute),
    '--hunt-faint': channels(colors.faint),
    '--hunt-line': channels(colors.line),
    '--hunt-line-strong': channels(colors.lineStrong),
    '--hunt-card': channels(colors.card),
    '--hunt-accent': channels(colors.accent),
    '--hunt-accent-deep': channels(colors.accentDeep),
    '--hunt-gold': channels(colors.gold),
    '--hunt-blush': channels(colors.blush),
    '--hunt-danger': channels(colors.danger),
    '--hunt-danger-soft': channels(colors.dangerSoft),
    '--hunt-good': channels(colors.good),
    '--hunt-good-soft': channels(colors.goodSoft),
    '--hunt-on-accent': channels(colors.onAccent),
    '--hunt-placeholder': channels(colors.placeholder),
  };
}

export function useHuntVariant(): HuntVariant {
  return useColorScheme() === 'dark' ? 'journal' : 'white';
}

export function useHuntColors() {
  return useHuntVariant() === 'journal' ? huntJournal : huntWhite;
}

export function useHuntTheme() {
  const variant = useHuntVariant();
  const colors = variant === 'journal' ? huntJournal : huntWhite;
  return { variant, colors, isJournal: variant === 'journal', isWhite: variant === 'white' };
}

export function useHuntVars() {
  const colors = useHuntColors();
  return vars(huntCssVariables(colors));
}
