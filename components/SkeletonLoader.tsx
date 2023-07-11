// @ts-nocheck
// Ignore TS in this file because Masked view is broken

import * as React from 'react';
import { View, StyleSheet, LayoutRectangle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

export const SkeletonLoader = ({
  children,
  backgroundColor,
  highlightColor,
}: {
  children: React.ReactNode;
  backgroundColor: string;
  highlightColor: string;
}) => {
  const [layout, setLayout] = React.useState<LayoutRectangle>();
  const shared = useSharedValue(0);

  React.useEffect(() => {
    shared.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      Infinity,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          shared.value,
          [0, 1],
          [layout ? -layout.width : 0, layout ? layout.width : 0],
        ),
      },
    ],
  }));

  if (!layout) {
    return (
      <View onLayout={event => setLayout(event.nativeEvent.layout)}>
        {children}
      </View>
    );
  }

  return (
    <MaskedView
      maskElement={children}
      style={{
        width: layout.width,
        height: layout.height,
      }}>
      <View style={[styles.background, { backgroundColor }]} />
      <Reanimated.View
        style={[StyleSheet.absoluteFill, animatedStyle]}>
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
              colors={['transparent', 'black', 'transparent']}
            />
          }>
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: highlightColor },
            ]}
          />
        </MaskedView>
      </Reanimated.View>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  background: {
    flexGrow: 1,
    overflow: 'hidden',
  },
});
