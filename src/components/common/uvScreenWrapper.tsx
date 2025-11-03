import React, { ReactNode } from 'react';
import { StatusBar, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: ReactNode;
  conatinerStyle?: ViewStyle;
  translucent?: boolean;
  inverted?: boolean;
}

const UvScreenWrapper = ({
  children,
  conatinerStyle,
  translucent = true,
  inverted = false,
}: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();
  
  const gradientColors = inverted
    ? ["#02080B", "#04202B", "#0B6E9A"]
    : ["#0B6E9A", "#04202B", "#02080B"];

  const gradientLocations = [0, 0.2, 1];

  return (
    <LinearGradient
    
      colors={gradientColors}
      locations={gradientLocations}
      start={{ x: 0.5, y: 0.0 }}
      end={{ x: 0.5, y: 1.0 }}
      style={[
        styles.container,
        conatinerStyle,
      ]}
    >
      <StatusBar barStyle="light-content" translucent={translucent} />
      <View style={{ paddingTop: insets.top, flex: 1 }}>
        {children}
      </View>
    </LinearGradient>
  )
}

export default UvScreenWrapper

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
