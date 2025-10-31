import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ResetPasswordScreen: undefined;
  ForgotPasswordScreen: undefined;
};

export type MainTabParamList = {
  HomeScreen: undefined;
};

export type RootStackParamList = {
  SplashScreen: undefined;
  OnboardingScreen: undefined;
  AuthStack: NavigatorScreenParams<AuthStackParamList> | undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
};
