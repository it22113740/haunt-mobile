import { Label } from '@/components/ui/typography';
import { useHauntTheme } from '@/theme/colors';
import { Eye, EyeOff } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useId, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';

type TextFieldProps = {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'email' | 'password' | 'username' | 'name' | 'off' | 'new-password';
  maxLength?: number;
  centered?: boolean;
  mono?: boolean;
  large?: boolean;
  multiline?: boolean;
  leftIcon?: ReactNode;
  /** `line` is the underlined journal input, `box` the outlined search-style input. */
  variant?: 'line' | 'box';
  /** Bold display text size for headline-style inputs (e.g. offer headline, place name). */
  displaySize?: number;
  /** Unit shown after the value, e.g. `pts`. */
  suffix?: string;
  /** Show the eye button that reveals a `secure` value. */
  revealable?: boolean;
};

const RULE = 34;

export function TextField({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  placeholder,
  secure,
  keyboardType,
  autoCapitalize = 'none',
  autoComplete,
  maxLength,
  centered,
  mono,
  large,
  multiline,
  leftIcon,
  variant = 'line',
  displaySize,
  suffix,
  revealable = true,
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(Boolean(secure));
  const { colors, isJournal } = useHauntTheme();
  const ruleId = `rl${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const restLine = isJournal ? colors.ink : colors.lineStrong;
  const lineColor = error ? colors.danger : focused && !isJournal ? colors.ink : restLine;
  const lineWidth = isJournal ? 1.5 : 1;

  const fontFamily = displaySize
    ? 'BricolageGrotesque_700Bold'
    : large
      ? 'IBMPlexMono_500Medium'
      : mono
        ? 'IBMPlexMono_400Regular'
        : centered
          ? 'BricolageGrotesque_700Bold'
          : 'BricolageGrotesque_400Regular';
  const fontSize = displaySize ?? (large ? 22 : variant === 'box' ? 16 : 17);

  const input = (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onBlur={() => {
        setFocused(false);
        onBlur?.();
      }}
      onFocus={() => setFocused(true)}
      placeholder={placeholder}
      placeholderTextColor={colors.faint}
      selectionColor={colors.accent}
      cursorColor={colors.accent}
      secureTextEntry={secure ? hidden : false}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
      autoComplete={autoComplete}
      maxLength={maxLength}
      multiline={multiline}
      accessibilityLabel={label ?? placeholder}
      textAlignVertical={multiline ? 'top' : 'center'}
      style={[
        {
          flex: 1,
          color: colors.ink,
          fontFamily,
          fontSize,
          paddingHorizontal: variant === 'box' ? 0 : 2,
          letterSpacing: large || centered ? fontSize * 0.08 : mono ? fontSize * 0.02 : 0,
          textAlign: centered ? 'center' : 'left',
        },
        multiline
          ? { minHeight: RULE * 3, lineHeight: RULE, paddingTop: 4, paddingBottom: 0 }
          : { height: variant === 'box' ? '100%' : 48, paddingVertical: 0 },
      ]}
    />
  );

  return (
    <View style={{ gap: 6 }}>
      {label ? <Label>{label}</Label> : null}
      {multiline ? (
        <View style={{ position: 'relative' }}>
          <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
            <Defs>
              <Pattern id={ruleId} width={8} height={RULE} patternUnits="userSpaceOnUse">
                <Rect y={RULE - 1} width={8} height={1} fill={error ? colors.danger : colors.ruled} />
              </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#${ruleId})`} />
          </Svg>
          {input}
        </View>
      ) : (
        <View
          style={[
            { flexDirection: 'row', alignItems: 'center', gap: 10 },
            variant === 'box'
              ? {
                  height: 50,
                  paddingHorizontal: 14,
                  borderRadius: 10,
                  backgroundColor: colors.card,
                  borderWidth: isJournal ? 1.5 : 1,
                  borderColor: error ? colors.danger : isJournal ? colors.ink : focused ? colors.lineStrong : colors.line,
                }
              : { borderBottomWidth: lineWidth, borderBottomColor: lineColor },
          ]}>
          {leftIcon}
          {input}
          {suffix ? (
            <Text style={{ fontFamily: 'IBMPlexMono_400Regular', fontSize: 13, color: colors.mute }}>{suffix}</Text>
          ) : null}
          {secure && revealable ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
              onPress={() => setHidden((current) => !current)}
              hitSlop={6}
              style={{ height: 44, width: 36, alignItems: 'center', justifyContent: 'center' }}>
              {hidden ? <Eye color={colors.mute} size={20} /> : <EyeOff color={colors.mute} size={20} />}
            </Pressable>
          ) : null}
        </View>
      )}
      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          style={{ fontFamily: 'BricolageGrotesque_400Regular', fontSize: 13, color: colors.danger }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
