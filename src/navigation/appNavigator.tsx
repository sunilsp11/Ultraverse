import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ForgotPasswordScreen from "../screens/authStack/forgotPasswordScreen";
import LoginScreen from "../screens/authStack/loginScreen";
import RegisterScreen from "../screens/authStack/registerScreen";
import ResetPasswordScreen from "../screens/authStack/resetPasswordScreen";
import HomeScreen from "../screens/homeStack/homeScreen";
import GameDetailsScreen from "../screens/homeStack/gameDetailsScreen";
import GameFeedbackScreen from "../screens/homeStack/gameFeedbackScreen";
import GameFeedbackThankYouScreen from "../screens/homeStack/gameFeedbackThankYouScreen";
import PlatformFeedbackScreen from "../screens/homeStack/platformFeedbackScreen";
import GamesScreen from "../screens/mainTabs/gamesScreen";
import ProfileScreen from "../screens/mainTabs/profileScreen";
import SearchScreen from "../screens/mainTabs/searchScreen";
import EditProfileScreen from "../screens/mainTabs/editProfileScreen.tsx";
import OnboardingScreen from "../screens/onboardingStack/onboardingScreen";
import SplashScreen from "../screens/onboardingStack/splashScreen";

import GameIcon from "../assets/svg/gameIcon.svg";
import HomeIcon from "../assets/svg/home.svg";
import ProfileIcon from "../assets/svg/profile.svg";
import SearchIcon from "../assets/svg/search.svg";
import Colors from "../theme/color";
import {
  AuthStackParamList,
  MainTabParamList,
  RootStackParamList,
} from "../types/navigationTypes";
import CustomTabBar from "../components/navigation/customTabBar";

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
      name="SearchScreen"
      component={SearchScreen}
      options={{
        tabBarLabel: "Search",
        tabBarIcon: ({ focused, color, size }) => (
          <SearchIcon
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
      name="ProfileScreen"
      component={ProfileScreen}
      options={{
        tabBarLabel: "Profile",
        tabBarIcon: ({ focused, color, size }) => (
          <ProfileIcon
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
  return (
    <NavigationContainer>
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
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
