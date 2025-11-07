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
  const overlayFadeAnim = useRef(new Animated.Value(1)).current;
  const soundRef = useRef<Sound | null>(null);
  const [shouldShowOnboarding, setShouldShowOnboarding] =
    useState<boolean>(true);
  const [hasSession, setHasSession] = useState<boolean>(false);
  const [appStateLoaded, setAppStateLoaded] = useState<boolean>(false);
  const hasNavigatedRef = useRef(false);

  const navigateToNextScreen = useCallback(() => {
    if (hasNavigatedRef.current || !appStateLoaded) return;
    hasNavigatedRef.current = true;

    if (shouldShowOnboarding) {
      navigation.reset({
        index: 0,
        routes: [{ name: "OnboardingScreen" }],
      });
      return;
    }

    if (hasSession) {
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
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
  }, [appStateLoaded, hasSession, navigation, shouldShowOnboarding]);

  useEffect(() => {
    Sound.setCategory(Platform.OS === "ios" ? "Playback" : "Ambient", true);

    const loadAppState = async () => {
      try {
        const [storedOnboardingValue, storedToken] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING),
          AsyncStorage.getItem("UserToken"),
        ]);

        setShouldShowOnboarding(storedOnboardingValue !== "true");
        setHasSession(!!storedToken);
      } catch (error) {
        console.log("Failed to read onboarding state", error);
        setShouldShowOnboarding(true);
        setHasSession(false);
      } finally {
        setAppStateLoaded(true);
      }
    };

    void loadAppState();

    const sound = new Sound(
      "epic_glitch_logo_402329.mp3",
      Sound.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.log("Failed to load sound:", error);
          return;
        }
        sound.setVolume(0.8);
        sound.play((success) => {
          if (success) console.log("Audio finished");
          else console.log("Playback failed");
          sound.release();
        });
      }
    );

    soundRef.current = sound;

    setTimeout(() => {
      Animated.timing(overlayFadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 200);

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

    const navigateTimer = setTimeout(() => {
      navigateToNextScreen();
    }, 3000);

    return () => {
      clearTimeout(navigateTimer);
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current?.release();
          soundRef.current = null;
        });
      }
    };
  }, [navigateToNextScreen]);

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
        disableFocus={true}
        onError={(e) => console.log("🎥 Video error:", e)}
        onBuffer={(e) => console.log("⏳ Buffering video...", e.isBuffering)}
      />
      <Animated.View style={[styles.overlay, { backgroundColor }]} />
      {renderLogo()}
      <Animated.View
        style={[
          styles.fadeOverlay,
          {
            opacity: overlayFadeAnim,
          },
        ]}
      />
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
    width: 180,
    height: 180,
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
  fadeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    zIndex: 999,
  },
  invisible: {
    width: 1,
    height: 1,
    position: "absolute",
    opacity: 0,
  },
});
