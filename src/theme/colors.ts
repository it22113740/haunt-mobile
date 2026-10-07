import { vars } from 'nativewind';
import { useColorScheme } from 'react-native';
import { hauntTokens } from '@/theme/tokens';

export type HauntColors = { [Key in keyof typeof hauntTokens.light]: string };

export const hauntLight: HauntColors = hauntTokens.light;
export const hauntDark: HauntColors = hauntTokens.dark;

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
    '--haunt-line': channels(colors.line),
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
  };
}

export function useHauntColors() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? hauntDark : hauntLight;
}

export function useHauntVars() {
  const colors = useHauntColors();
  return vars(hauntCssVariables(colors));
}
