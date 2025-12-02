import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, NavigationState } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import Sound from "react-native-sound";
import ForgotPasswordScreen from "../screens/authStack/forgotPasswordScreen";
import LoginScreen from "../screens/authStack/loginScreen";
import RegisterScreen from "../screens/authStack/registerScreen";
import ResetPasswordScreen from "../screens/authStack/resetPasswordScreen";
import HomeScreen from "../screens/homeStack/homeScreen";
import GameDetailsScreen from "../screens/homeStack/gameDetailsScreen";
import GameFeedbackScreen from "../screens/homeStack/gameFeedbackScreen";
import GameFeedbackThankYouScreen from "../screens/homeStack/gameFeedbackThankYouScreen";
import PlatformFeedbackScreen from "../screens/homeStack/platformFeedbackScreen";
import UnityPlayScreen from "../screens/homeStack/unityPlayScreen";
import GamesScreen from "../screens/mainTabs/gamesScreen";
import ProfileScreen from "../screens/mainTabs/profileScreen";
import SearchScreen from "../screens/mainTabs/searchScreen";
import WalletScreen from "../screens/mainTabs/walletScreen";
import ChatScreen from "../screens/mainTabs/chatScreen";
import TechaidsScreen from "../screens/mainTabs/techaidsScreen";
import EditProfileScreen from "../screens/mainTabs/editProfileScreen.tsx";
import OnboardingScreen from "../screens/onboardingStack/onboardingScreen";
import SplashScreen from "../screens/onboardingStack/splashScreen";

import GameIcon from "../assets/svg/gameIcon.svg";
import HomeIcon from "../assets/svg/home.svg";
import TranslateIcon from "../assets/svg/translateIcon.svg";
import Colors from "../theme/color";
import {
  AuthStackParamList,
  MainTabParamList,
  RootStackParamList,
} from "../types/navigationTypes";
import CustomTabBar from "../components/navigation/customTabBar";
import WalletIcon from "../assets/svg/walletIcon.svg";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const AuthStackNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
    <AuthStack.Screen name="RegisterScreen" component={RegisterScreen} />
    <AuthStack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
    <AuthStack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

const MainTabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors?.base[500],
      tabBarInactiveTintColor: Colors?.base[300],
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: Colors?.base[950],
      },
    }}
  >
    <Tab.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ focused, color, size }) => (
          <HomeIcon
            width={size}
            height={size}
            color={focused ? color : Colors.base[200]}
          />
        ),
      }}
    />
       <Tab.Screen
      name="ChatScreen"
      component={ChatScreen}
      options={{
        tabBarLabel: "Chat",
        tabBarIcon: ({ focused, color, size }) => (
          <HomeIcon
            width={size}
            height={size}
            color={focused ? color : Colors.base[200]}
          />
        ),
      }}
    />
    <Tab.Screen
      name="GamesScreen"
      component={GamesScreen}
      options={{
        tabBarLabel: "Games",
        tabBarIcon: ({ focused, color, size }) => (
          <GameIcon
            width={size}
            height={size}
            color={focused ? color : Colors.base[200]}
          />
        ),
      }}
    />
 
    <Tab.Screen
      name="WalletScreen"
      component={WalletScreen}
      options={{
        tabBarLabel: "Wallet",
        tabBarIcon: ({ focused, color, size }) => (
          <WalletIcon
            width={size}
            height={size}
            color={focused ? color : Colors.base[200]}
          />
        ),
      }}
    />
    <Tab.Screen
      name="TechaidsScreen"
      component={TechaidsScreen}
      options={{
        tabBarLabel: "Techaids",
        tabBarIcon: ({ focused, color, size }) => (
          <TranslateIcon
            width={size}
            height={size}
            color={focused ? color : Colors.base[200]}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const backgroundSoundRef = useRef<Sound | null>(null);
  const hasStartedSoundRef = useRef(false);
  const previousRouteRef = useRef<string | undefined>(undefined);

  const startBackgroundMusic = () => {
    const bgSound = new Sound('ultraverse_bg_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load background sound', error);
        return;
      }

      bgSound.setVolume(0.5);
      bgSound.setNumberOfLoops(-1);

      bgSound.play((success) => {
        if (success) {
          console.log('Background sound started successfully');
        } else {
          console.log('Failed to play background sound');
        }
      });

      backgroundSoundRef.current = bgSound;
    });
  };

  const stopBackgroundMusic = () => {
    if (backgroundSoundRef.current) {
      backgroundSoundRef.current.stop(() => {
        backgroundSoundRef.current?.release();
        backgroundSoundRef.current = null;
        console.log('Background sound stopped and released');
      });
    }
  };

  const handleNavigationStateChange = (state: NavigationState | undefined) => {
    if (!state) return;

    const getCurrentRouteName = (navState: NavigationState): string | undefined => {
      const route = navState.routes[navState.index];
      if (route.state) {
        return getCurrentRouteName(route.state as NavigationState);
      }
      return route.name;
    };

    const currentRouteName = getCurrentRouteName(state);
    const previousRouteName = previousRouteRef.current;

    // Start music initially when leaving SplashScreen
    if (currentRouteName !== 'SplashScreen' && !hasStartedSoundRef.current) {
      hasStartedSoundRef.current = true;
      
      setTimeout(() => {
        startBackgroundMusic();
      }, 2000);
    }

    // Stop and reset music when navigating to UnityPlayScreen
    if (currentRouteName === 'UnityPlayScreen' && previousRouteName !== 'UnityPlayScreen') {
      console.log('Navigating to UnityPlayScreen - stopping music');
      stopBackgroundMusic();
    }

    // Restart music from beginning when leaving UnityPlayScreen
    if (previousRouteName === 'UnityPlayScreen' && currentRouteName !== 'UnityPlayScreen') {
      console.log('Leaving UnityPlayScreen - restarting music');
      setTimeout(() => {
        startBackgroundMusic();
      }, 500);
    }

    // Update previous route
    previousRouteRef.current = currentRouteName;
  };

  useEffect(() => {
    return () => {
      if (backgroundSoundRef.current) {
        backgroundSoundRef.current.stop();
        backgroundSoundRef.current.release();
        backgroundSoundRef.current = null;
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer onStateChange={handleNavigationStateChange}>
        <RootStack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{ headerShown: false }}
        >
          <RootStack.Screen name="SplashScreen" component={SplashScreen} />
          <RootStack.Screen
            name="OnboardingScreen"
            component={OnboardingScreen}
          />
          <RootStack.Screen name="AuthStack" component={AuthStackNavigator} />
          <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
          <RootStack.Screen name="GameDetailsScreen" component={GameDetailsScreen} />
          <RootStack.Screen name="GameFeedbackScreen" component={GameFeedbackScreen} />
          <RootStack.Screen name="GameFeedbackThankYouScreen" component={GameFeedbackThankYouScreen} />
          <RootStack.Screen name="PlatformFeedbackScreen" component={PlatformFeedbackScreen} />
          <RootStack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          <RootStack.Screen name="SearchScreen" component={SearchScreen} />
          <RootStack.Screen name="ProfileScreen" component={ProfileScreen} />
          <RootStack.Screen name="UnityPlayScreen" component={UnityPlayScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};



export default AppNavigator;
