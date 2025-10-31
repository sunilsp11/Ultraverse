import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LoginScreen from "../screens/authStack/loginScreen";
import RegisterScreen from "../screens/authStack/registerScreen";
import ResetPasswordScreen from "../screens/authStack/resetPasswordScreen";
import ForgotPasswordScreen from "../screens/authStack/forgotPasswordScreen";
import OnboardingScreen from "../screens/onboardingStack/onboardingScreen";
import SplashScreen from "../screens/onboardingStack/splashScreen";
import HomeScreen from "../screens/homeStack/homeScreen";
import SearchScreen from "../screens/mainTabs/searchScreen";
import GamesScreen from "../screens/mainTabs/gamesScreen";
import ProfileScreen from "../screens/mainTabs/profileScreen";
import CustomTabBar from "../components/navigation/customTabBar";

import {
  AuthStackParamList,
  MainTabParamList,
  RootStackParamList,
} from "../types/navigationTypes";
import { Icons } from "../components/common/uvIcons";
import Colors from "../theme/color";

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
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors?.base[500],
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
          <Icons
            type="Ionicons"
            name="home"
            color={color}
            size={size}
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
          <Icons
            type="Ionicons"
            name="search"
            color={color}
            size={size}
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
          <Icons
            type="Ionicons"
            name="game-controller"
            color={color}
            size={size}
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
          <Icons
            type="Ionicons"
            name="person"
            color={color}
            size={size}
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
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
