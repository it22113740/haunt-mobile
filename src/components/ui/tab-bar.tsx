import { hapticLight } from '@/components/ui/press';
import { useHauntColors } from '@/theme/colors';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useTabBarInset() {
  const insets = useSafeAreaInsets();
  return insets.bottom + 120;
}

type FloatingTabBarProps = BottomTabBarProps & {
  raisedRoute?: string;
};

export function FloatingTabBar({ state, descriptors, navigation, raisedRoute }: FloatingTabBarProps) {
  const colors = useHauntColors();
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" className="absolute left-3 right-3" style={{ bottom: Math.max(insets.bottom, 12) }}>
      <View className="h-[76px] flex-row items-center rounded-3xl bg-haunt-card px-1 shadow-card" style={{ elevation: 4 }}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const raised = route.name === raisedRoute;
          const color = raised ? colors.onAccent : focused ? colors.accent : colors.mute;
          const label = options.title ?? route.name;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected: focused }}
              onPress={() => {
                hapticLight();
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
              }}
              className="h-[68px] flex-1 items-center justify-center">
              <View className="h-11 w-11 items-center justify-center">
                {raised ? (
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-haunt-accent">
                    {options.tabBarIcon?.({ focused, color, size: 22 })}
                  </View>
                ) : (
                  options.tabBarIcon?.({ focused, color, size: 22 })
                )}
              </View>
              <Text
                numberOfLines={1}
                className={`mt-1 font-sans-semibold text-[11px] ${focused ? 'text-haunt-accent' : 'text-haunt-mute'}`}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
