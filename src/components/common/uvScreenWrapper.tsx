import React, { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, View, ViewStyle, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UvAssistant from './uvAssistant';
import Colors from '../../theme/color';

interface ScreenWrapperProps {
  children: ReactNode;
  conatinerStyle?: ViewStyle;
  translucent?: boolean;
  inverted?: boolean;
  showAssistant?: boolean;
  isScrollable?: boolean;
  isLoading?: boolean;
}

const UvScreenWrapper = ({
  children,
  conatinerStyle,
  translucent = true,
  inverted = false,
  showAssistant = false,
  isScrollable = false,
  isLoading = false,
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
      {isScrollable ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ paddingTop: insets.top + 10, flex: 1 }}>
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <View style={{ paddingTop: insets.top + 10, flex: 1 }}>
          {children}
        </View>
      )}
      {showAssistant && <UvAssistant />}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      )}
    </View>
  )
}

export default UvScreenWrapper

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
})
