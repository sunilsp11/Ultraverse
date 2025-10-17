import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface Props {
  index: number;
  total: number;
  scrollX?: Animated.Value;
  pageWidth?: number;
}

const Dots: React.FC<Props> = ({ index, total, scrollX, pageWidth = 1 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => {
        if (scrollX) {
          const inputRange = [(i - 1) * pageWidth, i * pageWidth, (i + 1) * pageWidth];
          const width = scrollX.interpolate({ inputRange, outputRange: [8, 60, 8], extrapolate: 'clamp' });
          const bg = scrollX.interpolate({ inputRange, outputRange: ['#333333', '#00B4FF', '#333333'], extrapolate: 'clamp' });
          const isActive = i === index;
          return (
            <Animated.View
              key={i}
              style={[
                styles.dotBase,
                isActive ? styles.dotActiveShape : styles.dotRoundShape,
                { width, backgroundColor: bg as any },
              ]}
            />
          );
        }
        const isActive = i === index;
        return (
          <View
            key={i}
            style={[styles.dotBase, isActive ? [styles.dotActive, styles.dotActiveShape] : styles.dotInactive]}
          />
        );
      })}
    </View>
  );
};

export default Dots;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dotBase: {
    height: 8,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  dotActive: {
    width: 60,
    backgroundColor: "#00B4FF",
  },
  dotActiveShape: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 4,
  },
  dotRoundShape: {
    borderRadius: 4,
  },
});


