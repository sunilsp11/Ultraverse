import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import GoogleIcon from "../../assets/svg/google.svg";
import FacebookIcon from "../../assets/svg/facebook.svg";
import Colors from "../../theme/color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile } from "../../services/profile/profileApi";
import { useSocialLoginMutation } from "../../services/authRequest/authApi";
import { signInWithGoogle } from "../../config/googleSignIn";
import { LoginProvider } from "../../screens/authStack/loginScreen";
import { useAppDispatch } from "../../store/store";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList, RootStackParamList } from "../../types/navigationTypes";
import { setAuthProvider, setProfile } from "../../store/slices/profileSlice";

type LoginNavigationProp = CompositeNavigationProp<
NativeStackNavigationProp<AuthStackParamList, "LoginScreen">,
NativeStackNavigationProp<RootStackParamList>
>;

const UvSocialLogins = () => {
  const dispatch = useAppDispatch();

  const navigation = useNavigation<LoginNavigationProp>();
  const [isGoogleSignInInProgress, setGoogleSignInInProgress] = useState(false);
  const [socialLogin, { isLoading: isSocialLoginLoading }] =
    useSocialLoginMutation();
  const isGoogleBusy = useMemo(
    () => isGoogleSignInInProgress || isSocialLoginLoading,
    [isGoogleSignInInProgress, isSocialLoginLoading]
  );
  const handleGoogleLogin = async () => {
    if (isGoogleBusy) {
      return;
    }

    try {
      setGoogleSignInInProgress(true);
      const userInfo = await signInWithGoogle();
      if (!userInfo) {
        return;
      }

      const wrappedData: any = (userInfo as any)?.data ?? userInfo;
      const user = wrappedData?.user ?? (userInfo as any)?.user ?? null;
      const idToken =
        wrappedData?.idToken ??
        wrappedData?.id_token ??
        (userInfo as any)?.idToken ??
        null;

      if (!idToken) {
        Alert.alert(
          "Google Login Failed",
          "Unable to retrieve a valid ID token from Google."
        );
        return;
      }
      const nowIso = new Date().toISOString();

      const response = await socialLogin({
        provider: LoginProvider.google,
        id_token: idToken,
      }).unwrap();

      console.log("response", JSON.stringify(response, null, 2));
      await AsyncStorage.setItem("UserToken", response.token);
      await AsyncStorage.setItem("UserRefreshToken", response.refresh);
      await AsyncStorage.removeItem("UserAccessToken");

      const resolvedProfile: UserProfile = {
        id: response.id ?? 0,
        username:
          response.username ||
          response.email ||
          user?.email ||
          `user-${response.id ?? Date.now()}`,
        email: response.email || user?.email || "",
        first_name: response.first_name || user?.givenName || null,
        profile_picture: user?.photo ?? null,
        profile_picture_url: user?.photo ?? null,
        created_at: nowIso,
        updated_at: nowIso,
      };

      dispatch(setProfile(resolvedProfile));

      dispatch(setAuthProvider("google"));

      (navigation as any).reset({
        index: 0,
        routes: [
          {
            name: "MainTabs",
            params: { screen: "HomeScreen" },
          },
        ],
      });
    } catch (err: any) {
      console.log("Google login error:", err);
      const message =
        err?.data?.detail ||
        err?.data?.message ||
        err?.message ||
        "Please try again";
      Alert.alert("Google Login Failed", message);
    } finally {
      setGoogleSignInInProgress(false);
    }
  };

  return (
    <View style={styles.socialRow}>
      <TouchableOpacity
        onPress={handleGoogleLogin}
        style={[
          styles.socialCircle,
          isGoogleBusy && styles.socialCircleDisabled,
        ]}
        disabled={isGoogleBusy}
        accessibilityRole="button"
        accessibilityLabel="Continue with Google"
      >
        {isGoogleBusy ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <GoogleIcon width={24} height={24} color="#0F5270" />
        )}
      </TouchableOpacity>
      {/* <View style={styles.socialCircle}>
        <FacebookIcon width={24} height={24} color="#0F5270" />
      </View> */}
    </View>
  );
};

export default UvSocialLogins;

const styles = StyleSheet.create({
  socialRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 22,
  },
  socialCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  socialCircleDisabled: {
    opacity: 0.6,
  },
});
