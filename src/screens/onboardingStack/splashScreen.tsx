import {
  NavigationProp,
  NavigatorScreenParams,
  useNavigation,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import Sound from "react-native-sound";
import Video from "react-native-video";
import {
  AuthStackParamList,
  RootStackParamList,
} from "../../types/navigationTypes";
import { STORAGE_KEYS } from "../../constants/storageKeys";

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bgFadeAnim = useRef(new Animated.Value(1)).current;
  const soundRef = useRef<Sound | null>(null);
  const [shouldShowOnboarding, setShouldShowOnboarding] =
    useState<boolean | null>(null);

  useEffect(() => {
    // Allow video + sound to play together
    Sound.setCategory(Platform.OS === "ios" ? "Playback" : "Ambient", true);

    const loadOnboardingState = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(
          STORAGE_KEYS.HAS_SEEN_ONBOARDING
        );
        setShouldShowOnboarding(storedValue !== "true");
      } catch (error) {
        console.log("Failed to read onboarding state", error);
        setShouldShowOnboarding(true);
      }
    };

    void loadOnboardingState();

    // Load and play your audio
    const sound = new Sound(
      "epic_glitch_logo_402329.mp3",
      Sound.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.log("❌ Failed to load sound:", error);
          return;
        }
        sound.setVolume(0.8);
        sound.play((success) => {
          if (success) console.log("✅ Audio finished");
          else console.log("❌ Playback failed");
          sound.release();
        });
      }
    );

    soundRef.current = sound;

    // Start logo animations
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(bgFadeAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }, 2000);
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current?.release();
          soundRef.current = null;
        });
      }
    };
  }, []);

  const handleVideoEnd = useCallback(() => {
    const shouldShow = shouldShowOnboarding ?? true;

    if (shouldShow) {
      navigation.reset({
        index: 0,
        routes: [{ name: "OnboardingScreen" }],
      });
      return;
    }

    const authStackParams: NavigatorScreenParams<AuthStackParamList> = {
      screen: "LoginScreen",
    };

    navigation.reset({
      index: 0,
      routes: [{ name: "AuthStack", params: authStackParams }],
    });
  }, [navigation, shouldShowOnboarding]);

  const backgroundColor = bgFadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0,0,0,2)", "rgba(0,0,0,0.1)"],
  });

  const renderLogo = () => (
    <Animated.View
      style={[
        styles.logoContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logoImage}
        resizeMode="contain"
      />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Video
        source={require("../../assets/videos/portal_animation.mp4")}
        style={styles.videoBackground}
        resizeMode="cover"
        repeat={false}
        muted={false}
        paused={false}
        playInBackground={true}
        playWhenInactive={true}
        ignoreSilentSwitch="ignore"
        disableFocus={true} // ✅ prevents Android from stopping video when sound starts
        onError={(e) => console.log("🎥 Video error:", e)}
        onBuffer={(e) => console.log("⏳ Buffering video...", e.isBuffering)}
        onEnd={handleVideoEnd}
      />
      <Animated.View style={[styles.overlay, { backgroundColor }]} />
      {renderLogo()}
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 160,
    height: 160,
  },
  videoBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  invisible: {
    width: 1,
    height: 1,
    position: "absolute",
    opacity: 0,
  },
});
