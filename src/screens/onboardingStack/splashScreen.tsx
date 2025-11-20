import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationProp,
  NavigatorScreenParams,
  useNavigation,
} from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import Video from "react-native-video";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import {
  AuthStackParamList,
  RootStackParamList,
} from "../../types/navigationTypes";
import Sound from "react-native-sound";
import UvTypography from "../../components/common/uvTypography";
import Colors from "../../theme/color";

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bgFadeAnim = useRef(new Animated.Value(0.8)).current;
  const overlayFadeAnim = useRef(new Animated.Value(1)).current;

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

    Animated.timing(overlayFadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  
    Animated.timing(overlayFadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  
    // Logo fade + scale (0 → 1500ms)
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
    ]).start();

    // Background fade animation: darker → lighter → darker
    Animated.sequence([
      Animated.timing(bgFadeAnim, {
        toValue: 0.2, // lighter
        duration: 3000,
        useNativeDriver: false,
      }),
      Animated.timing(bgFadeAnim, {
        toValue: 0.8, // darker
        duration: 3000,
        useNativeDriver: false,
      }),
    ]).start();

    return () => {
      
    };
  }, []);

  const splashScreenSound = new Sound("splash_screen_bg_sound.mp3", Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log("Failed to load the sound", error);
      return;
    }

    splashScreenSound.setVolume(0.05);
    splashScreenSound.play((success) => {
      if (success) {
        navigateToNextScreen();
      } else {
        navigateToNextScreen();
      }
    });
  });

  const backgroundColor = bgFadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0,0,0,0.1)", "rgba(0,0,0,0.8)"],
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
        source={require("../../assets/images/spalshScreenLogo.png")}
        style={styles.logoImage}
        resizeMode="contain"
      />
       <UvTypography variant="h4" align="center" color={Colors.base[50]}>
        ULTRAVERSE
      </UvTypography>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Video
        source={require("../../assets/videos/portal_animation.mp4")}
        style={styles.videoBackground}
        resizeMode="cover"
        repeat={true}
        muted={true}
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
    width: 120,
    height: 120,
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
