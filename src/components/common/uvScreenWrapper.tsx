import React, { ReactNode } from 'react';
import { StatusBar, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UvAssistant from './uvAssistant';

interface ScreenWrapperProps {
  children: ReactNode;
  conatinerStyle?: ViewStyle;
  translucent?: boolean;
  inverted?: boolean;
  showAssistant?: boolean;
}

const UvScreenWrapper = ({
  children,
  conatinerStyle,
  translucent = true,
  inverted = false,
  showAssistant = false,
}: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();
  
  const gradientColors = inverted
    ? ["#02080B", "#04202B", "#0B6E9A"]
    : ["#0B6E9A", "#04202B", "#02080B"];

  const gradientLocations = [0, 0.2, 1];

  return (
    <View style={[styles.container, conatinerStyle]}> 
      <LinearGradient
        colors={gradientColors}
        locations={gradientLocations}
        start={{ x: 0.5, y: 0.0 }}
        end={{ x: 0.5, y: 1.0 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <StatusBar barStyle="light-content" translucent={translucent} backgroundColor="transparent" />
      <View style={{ paddingTop: insets.top + 10, flex: 1}}>
        {children}
        {showAssistant && <UvAssistant />}
      </View>
    </View>
  )
}

export default UvScreenWrapper

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
