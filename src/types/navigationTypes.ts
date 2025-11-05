import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ResetPasswordScreen: undefined;
  ForgotPasswordScreen: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
};

export type MainTabParamList = {
  HomeScreen: undefined;
  SearchScreen: undefined;
  GamesScreen: undefined;
  ProfileScreen: undefined;
};

export type RootStackParamList = {
  GameDetailsScreen: {
    gameId: string;
    gameTitle: string;
    gameImage: any;
    genre?: string;
    description?: string;
    gameInfo?:string
  };
  GameFeedbackScreen: {
    gameId: string;
  };
  GameFeedbackThankYouScreen: undefined;
  PlatformFeedbackScreen: undefined;
  SplashScreen: undefined;
  OnboardingScreen: undefined;
  AuthStack: NavigatorScreenParams<AuthStackParamList> | undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  EditProfileScreen: undefined;
  SearchScreen: undefined;
};
