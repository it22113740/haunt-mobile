import { vars } from 'nativewind';
import { useColorScheme } from 'react-native';
import { hauntTokens, type HauntVariant } from '@/theme/tokens';

export type HauntColors = { [Key in keyof typeof hauntTokens.journal]: string };

export const hauntJournal: HauntColors = hauntTokens.journal;
export const hauntWhite: HauntColors = hauntTokens.white;

function channels(hex: string) {
  const value = hex.replace('#', '');
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `${red} ${green} ${blue}`;
}

export function hauntCssVariables(colors: HauntColors) {
  return {
    '--haunt-paper': channels(colors.paper),
    '--haunt-ink': channels(colors.ink),
    '--haunt-mute': channels(colors.mute),
    '--haunt-faint': channels(colors.faint),
    '--haunt-line': channels(colors.line),
    '--haunt-line-strong': channels(colors.lineStrong),
    '--haunt-card': channels(colors.card),
    '--haunt-accent': channels(colors.accent),
    '--haunt-accent-deep': channels(colors.accentDeep),
    '--haunt-gold': channels(colors.gold),
    '--haunt-blush': channels(colors.blush),
    '--haunt-danger': channels(colors.danger),
    '--haunt-danger-soft': channels(colors.dangerSoft),
    '--haunt-good': channels(colors.good),
    '--haunt-good-soft': channels(colors.goodSoft),
    '--haunt-on-accent': channels(colors.onAccent),
    '--haunt-placeholder': channels(colors.placeholder),
  };
}

export function useHauntVariant(): HauntVariant {
  return useColorScheme() === 'dark' ? 'journal' : 'white';
}

export function useHauntColors() {
  return useHauntVariant() === 'journal' ? hauntJournal : hauntWhite;
}

export function useHauntTheme() {
  const variant = useHauntVariant();
  const colors = variant === 'journal' ? hauntJournal : hauntWhite;
  return { variant, colors, isJournal: variant === 'journal', isWhite: variant === 'white' };
}

export function useHauntVars() {
  const colors = useHauntColors();
  return vars(hauntCssVariables(colors));
}
