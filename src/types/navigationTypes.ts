import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ResetPasswordScreen: undefined;
  ForgotPasswordScreen: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  GameDetailsScreen: {
    gameId: string;
    gameTitle: string;
    gameImage: any;
    genre?: string;
    description?: string;
  };
};

export type MainTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList> | undefined;
  SearchScreen: undefined;
  GamesScreen: undefined;
  ProfileScreen: undefined;
};

export type RootStackParamList = {
  SplashScreen: undefined;
  OnboardingScreen: undefined;
  AuthStack: NavigatorScreenParams<AuthStackParamList> | undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
};
