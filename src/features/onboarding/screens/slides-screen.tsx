import { Illustration, type IllustrationName } from '@/components/illustration';
import { Button } from '@/components/ui/button';
import { ScreenEnter } from '@/components/ui/enter';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const slides: { name: IllustrationName; title: string; body: string }[] = [
  {
    name: 'onb-discover',
    title: 'Find your next haunt',
    body: 'Discover restaurants and bars near you that reward you for showing up.',
  },
  {
    name: 'onb-capture',
    title: 'Snap your visit',
    body: 'Share a photo or video from inside the venue. Owners approve it in minutes.',
  },
  {
    name: 'onb-earn',
    title: 'Earn points, unlock perks',
    body: 'Every approved post adds points. Spend them on free drinks, meals and discounts.',
  },
  {
    name: 'onb-owner',
    title: 'Own a venue?',
    body: 'Publish perks, review guest content and turn regulars into promoters.',
  },
];

export function SlidesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const pageWidth = useSharedValue(width);
  const page = useSharedValue(0);
  const listRef = useRef<Animated.FlatList<(typeof slides)[number]>>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    pageWidth.value = width;
  }, [pageWidth, width]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const next = Math.round(event.contentOffset.x / pageWidth.value);
      if (next !== page.value) {
        page.value = next;
        runOnJS(setIndex)(next);
      }
    },
  });

  const goRole = () => router.push('/(onboarding)/role');

  return (
    <ScreenEnter className="flex-1 bg-haunt-paper" style={{ paddingTop: insets.top + 8 }}>
      <View className="items-end px-6">
        <Pressable accessibilityRole="button" onPress={goRole} className="h-11 justify-center">
          <Text className="font-sans-semibold text-body text-haunt-mute">Skip</Text>
        </Pressable>
      </View>
      <Animated.FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(item) => item.name}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, itemIndex) => ({ length: width, offset: width * itemIndex, index: itemIndex })}
        renderItem={({ item, index: itemIndex }) => (
          <Slide item={item} index={itemIndex} width={width} scrollX={scrollX} />
        )}
      />
      <View className="px-6" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Dots count={slides.length} scrollX={scrollX} width={width} />
        <View className="mt-6">
          <Button
            label={index === slides.length - 1 ? 'Get started' : 'Next'}
            onPress={() => {
              if (index >= slides.length - 1) {
                goRole();
                return;
              }
              listRef.current?.scrollToIndex({ index: index + 1, animated: true });
            }}
          />
        </View>
      </View>
    </ScreenEnter>
  );
}

function Slide({
  item,
  index,
  width,
  scrollX,
}: {
  item: (typeof slides)[number];
  index: number;
  width: number;
  scrollX: SharedValue<number>;
}) {
  const art = useAnimatedStyle(() => {
    const range = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      opacity: interpolate(scrollX.value, range, [0.25, 1, 0.25], Extrapolation.CLAMP),
      transform: [{ translateX: interpolate(scrollX.value, range, [width * 0.35, 0, -width * 0.35], Extrapolation.CLAMP) }],
    };
  });

  return (
    <View style={{ width }} className="flex-1 justify-center px-8">
      <View className="items-center justify-center">
        <View className="absolute h-64 w-64 rounded-full bg-haunt-blush" />
        <Animated.View style={art}>
          <Illustration name={item.name} size={220} />
        </Animated.View>
      </View>
      <Text className="mt-10 text-center font-display text-display-lg text-haunt-ink">{item.title}</Text>
      <Text className="mt-3 text-center font-sans text-body text-haunt-mute">{item.body}</Text>
    </View>
  );
}

function Dots({ count, scrollX, width }: { count: number; scrollX: SharedValue<number>; width: number }) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: count }, (_, index) => (
        <Dot key={index} index={index} scrollX={scrollX} width={width} />
      ))}
    </View>
  );
}

function Dot({ index, scrollX, width }: { index: number; scrollX: SharedValue<number>; width: number }) {
  const style = useAnimatedStyle(() => {
    const progress = interpolate(scrollX.value / width, [index - 1, index, index + 1], [0, 1, 0], Extrapolation.CLAMP);
    return { width: interpolate(progress, [0, 1], [8, 24]) };
  });

  return <Animated.View style={style} className="h-2 rounded-full bg-haunt-accent" />;
}
