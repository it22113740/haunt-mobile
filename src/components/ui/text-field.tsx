import { useHauntColors } from '@/theme/colors';
import { Eye, EyeOff } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Pressable, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

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
};

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
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(Boolean(secure));
  const colors = useHauntColors();
  const border = error ? 'border-haunt-danger' : focused ? 'border-haunt-ink' : 'border-haunt-line';

  return (
    <View>
      {label ? <Text className="mb-2 font-sans text-caption text-haunt-mute">{label}</Text> : null}
      <View
        className={`${multiline ? 'min-h-28 items-start py-3' : large ? 'h-16 items-center' : 'h-14 items-center'} flex-row rounded-2xl border bg-haunt-card px-4 ${border}`}>
        {leftIcon ? <View className="mr-3">{leftIcon}</View> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={colors.mute}
          secureTextEntry={secure ? hidden : false}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          autoComplete={autoComplete}
          maxLength={maxLength}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          className={`${multiline ? 'min-h-24' : large ? 'h-16 font-mono-bold text-title' : 'h-14 font-sans text-body'} flex-1 text-haunt-ink ${centered ? 'text-center font-display tracking-widest' : ''} ${mono && !large ? 'font-mono' : ''}`}
        />
        {secure ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            onPress={() => setHidden((current) => !current)}
            className="h-11 w-11 items-center justify-center">
            {hidden ? <Eye color={colors.mute} size={20} /> : <EyeOff color={colors.mute} size={20} />}
          </Pressable>
        ) : null}
      </View>
      {error ? <Text className="mt-2 font-sans text-caption text-haunt-danger">{error}</Text> : null}
    </View>
  );
}
