import { MotionView } from '@/components/ui/animated';
import { Illustration, type IllustrationName } from '@/components/illustration';
import { Button } from '@/components/ui/button';
import { ScreenEnter } from '@/components/ui/enter';
import { Body, H1, Label, Sub, Wordmark } from '@/components/ui/typography';
import { useSurfaces } from '@/theme/surfaces';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
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
    title: 'Find your next hunt',
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
  const { colors } = useSurfaces();
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
    <ScreenEnter className="flex-1 bg-hunt-paper" style={{ paddingTop: insets.top + 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <Wordmark />
        <Pressable accessibilityRole="button" onPress={goRole} hitSlop={8} style={{ height: 44, justifyContent: 'center' }}>
          <Body size={15} weight="semibold" color={colors.mute} style={{ textDecorationLine: 'underline' }}>
            Skip
          </Body>
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
      <View style={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 14) + 10 }}>
        <Dots count={slides.length} scrollX={scrollX} width={width} />
        <View style={{ marginTop: 24 }}>
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
  const { colors } = useSurfaces();
  const art = useAnimatedStyle(() => {
    const range = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      opacity: interpolate(scrollX.value, range, [0.25, 1, 0.25], Extrapolation.CLAMP),
      transform: [{ translateX: interpolate(scrollX.value, range, [width * 0.35, 0, -width * 0.35], Extrapolation.CLAMP) }],
    };
  });

  return (
    <View style={{ width, flex: 1, justifyContent: 'center', paddingHorizontal: 28 }}>
      <MotionView style={[art, { alignItems: 'center' }]}>
        <Illustration name={item.name} size={240} />
      </MotionView>
      <View style={{ marginTop: 28, gap: 10, alignItems: 'center' }}>
        <Label color={colors.accentDeep}>{`${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`}</Label>
        <H1 style={{ textAlign: 'center' }}>{item.title}</H1>
        <Sub style={{ textAlign: 'center', maxWidth: 320 }}>{item.body}</Sub>
      </View>
    </View>
  );
}

function Dots({ count, scrollX, width }: { count: number; scrollX: SharedValue<number>; width: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      {Array.from({ length: count }, (_, index) => (
        <Dot key={index} index={index} scrollX={scrollX} width={width} />
      ))}
    </View>
  );
}

function Dot({ index, scrollX, width }: { index: number; scrollX: SharedValue<number>; width: number }) {
  const { colors } = useSurfaces();
  const style = useAnimatedStyle(() => {
    const progress = interpolate(scrollX.value / width, [index - 1, index, index + 1], [0, 1, 0], Extrapolation.CLAMP);
    return { width: interpolate(progress, [0, 1], [8, 24]), opacity: interpolate(progress, [0, 1], [0.3, 1]) };
  });

  return <MotionView style={[{ height: 8, borderRadius: 4, backgroundColor: colors.accent }, style]} />;
}
