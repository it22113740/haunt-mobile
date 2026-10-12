import { hapticLight } from '@/components/ui/press';
import { useHauntTheme } from '@/theme/colors';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BAR_HEIGHT = 70;

function useBarHeight() {
  const insets = useSafeAreaInsets();
  return BAR_HEIGHT + Math.max(insets.bottom, 14);
}

/** Bottom padding for scroll content so the last row clears the tab bar. */
export function useTabBarInset() {
  return useBarHeight() + 24;
}

type FloatingTabBarProps = BottomTabBarProps & {
  raisedRoute?: string;
};

export function FloatingTabBar({ state, descriptors, navigation, raisedRoute }: FloatingTabBarProps) {
  const { colors, isJournal } = useHauntTheme();
  const insets = useSafeAreaInsets();
  const height = useBarHeight();

  return (
    <View
      accessibilityRole="tablist"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height,
        paddingHorizontal: 6,
        paddingBottom: Math.max(insets.bottom, 14),
        flexDirection: 'row',
        backgroundColor: colors.paper,
        borderTopWidth: isJournal ? 1.5 : 1,
        borderTopColor: isJournal ? colors.ink : colors.line,
      }}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const raised = route.name === raisedRoute;
        const color = focused ? colors.ink : colors.mute;
        const label = options.title ?? route.name;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: focused }}
            onPress={() => {
              hapticLight();
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
            }}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: raised ? 'flex-start' : 'center',
              gap: 4,
            }}>
            {raised ? (
              <View
                style={{
                  width: 58,
                  height: 58,
                  marginTop: -22,
                  borderRadius: 999,
                  backgroundColor: colors.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...(isJournal
                    ? { borderWidth: 1.5, borderColor: colors.ink, boxShadow: `0px 3px 0px ${colors.ink}` }
                    : { boxShadow: '0px 8px 18px -6px rgba(252,100,1,0.55)' }),
                }}>
                {options.tabBarIcon?.({ focused, color: colors.ink, size: 22 })}
              </View>
            ) : (
              options.tabBarIcon?.({ focused, color, size: 22 })
            )}
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'BricolageGrotesque_600SemiBold',
                fontSize: 11,
                color: focused ? colors.ink : colors.mute,
              }}>
              {label}
            </Text>
            {focused ? (
              <View
                style={{
                  position: 'absolute',
                  bottom: 4,
                  width: 5,
                  height: 5,
                  borderRadius: 9,
                  backgroundColor: colors.accent,
                }}
              />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
