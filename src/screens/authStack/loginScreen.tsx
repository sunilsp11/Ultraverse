import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import UvButton from "../../components/common/uvButton";
import UvFormTextInput from "../../components/common/uvFormTextInput";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvTypography from "../../components/common/uvTypography";
import Colors from "../../theme/color";
import {
  AuthStackParamList,
  RootStackParamList,
} from "../../types/navigationTypes";
import GoogleIcon from "../../assets/svg/google.svg";
import FacebookIcon from "../../assets/svg/facebook.svg";
import { useLoginMutation } from "../../services/authRequest/authApi";
import { useForm, Controller } from "react-hook-form";
import { signInWithGoogle } from "../../config/googleSignIn";
import { useAppDispatch } from "../../store/store";
import {
  setAuthProvider,
  setProfile,
} from "../../store/slices/profileSlice";
import { UserProfile } from "../../services/profile/profileApi";

const LoginScreen = () => {
  type LoginNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<AuthStackParamList, "LoginScreen">,
    NativeStackNavigationProp<RootStackParamList>
  >;

  const navigation = useNavigation<LoginNavigationProp>();
  const [login, { isLoading }] = useLoginMutation();
  const [isGoogleSignInInProgress, setGoogleSignInInProgress] =
    useState(false);
  const dispatch = useAppDispatch();

  type LoginFormData = {
    email: string;
    password: string;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    if (isLoading) return;

    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      const token = response?.tokens?.access;

      if (token) {
        await AsyncStorage.setItem("UserToken", token);
        await AsyncStorage.removeItem("UserAccessToken");
        dispatch(setAuthProvider("credentials"));

        (navigation as any).reset({
          index: 0,
          routes: [
            {
              name: "MainTabs",
              params: { screen: "HomeScreen" },
            },
          ],
        });
      } else {
        console.warn("Login succeeded but no access token found.", response);
      }
    } catch (error: any) {
      Alert.alert(
        "Login failed",
        error?.data?.message || "Please check your credentials and try again"
      );
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleSignInInProgress) {
      return;
    }

    try {
      setGoogleSignInInProgress(true);
      const userInfo = await signInWithGoogle();

      if (!userInfo) {
        return;
      }

      const idToken = userInfo.idToken ?? null;
      const accessToken = userInfo.accessToken ?? null;

      if (!idToken) {
        Alert.alert(
          "Google Login Failed",
          "Unable to retrieve a valid token from Google."
        );
        return;
      }

      await AsyncStorage.setItem("UserToken", idToken);

      if (accessToken) {
        await AsyncStorage.setItem("UserAccessToken", accessToken);
      }

      const googleUser = userInfo.user;
      const nowIso = new Date().toISOString();

      if (googleUser) {
        const numericId = Number(googleUser.id);
        const resolvedId =
          Number.isFinite(numericId) && Number.isSafeInteger(numericId)
            ? numericId
            : 0;
        const syntheticProfile: UserProfile = {
          id: resolvedId,
          username: googleUser.email || googleUser.name || googleUser.id,
          email: googleUser.email || "",
          first_name: googleUser.givenName || googleUser.name || null,
          profile_picture: googleUser.photo ?? null,
          profile_picture_url: googleUser.photo ?? null,
          created_at: nowIso,
          updated_at: nowIso,
        };
        dispatch(setProfile(syntheticProfile));
      }

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
      Alert.alert("Google Login Failed", err?.message || "Please try again");
    } finally {
      setGoogleSignInInProgress(false);
    }
  };


  return (
    <UvScreenWrapper inverted={true} conatinerStyle={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ paddingHorizontal: 24, flex: 1 }}>
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/top_header_logo.png")}
              style={styles.topLogo}
              resizeMode="contain"
            />
            <UvTypography variant="h3" align="center">
              LOGIN
            </UvTypography>
            <View style={{ height: 8 }} />
            <UvTypography variant="p" color="#D7E7EE" align="center">
              Enter your email below to login to your account.
            </UvTypography>
          </View>

          <View style={styles.form}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              automaticallyAdjustKeyboardInsets={true}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.formContent}>
                <UvTypography
                  variant="h6"
                  color={Colors.white}
                  style={{ marginBottom: 8 }}
                >
                  EMAIL
                </UvTypography>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                    validate: (v) =>
                      (!!v && v.trim().length > 0) || "Email is required",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <UvFormTextInput
                        placeholder="Please enter your email address"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        variant="body"
                      />
                      {errors.email && (
                        <UvTypography
                          variant="bodyXs"
                          color={Colors.danger[400]}
                        >
                          {errors.email.message}
                        </UvTypography>
                      )}
                    </>
                  )}
                />

                <View style={{ height: 16 }} />

                <UvTypography
                  variant="h6"
                  color={Colors.white}
                  style={{ marginBottom: 8 }}
                >
                  PASSWORD
                </UvTypography>
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: "Password is required",
                    validate: (v) =>
                      (!!v && v.trim().length > 0) || "Password is required",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <UvFormTextInput
                        placeholder="Please enter your password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        showPasswordToggle={true}
                        autoCapitalize="none"
                        variant="body"
                      />
                      {errors.password && (
                        <UvTypography
                          variant="bodyXs"
                          color={Colors.danger[400]}
                        >
                          {errors.password.message}
                        </UvTypography>
                      )}
                    </>
                  )}
                />

                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPasswordScreen")}
                  style={styles.forgotBtn}
                >
                  <UvTypography variant="p" color="#D7E7EE">
                    Forgot Password?
                  </UvTypography>
                </TouchableOpacity>

                <View style={{ height: 16 }} />

                <UvButton onPress={handleSubmit(onSubmit)} title="Login" />

                <View style={styles.orRow}>
                  <View style={styles.divider} />
                  <UvTypography variant="bodyXs" color="#CFE2EA">
                    or continue with
                  </UvTypography>
                  <View style={styles.divider} />
                </View>

                <View style={styles.socialRow}>
                  <TouchableOpacity
                    onPress={handleGoogleLogin}
                    style={[
                      styles.socialCircle,
                      isGoogleSignInInProgress && styles.socialCircleDisabled,
                    ]}
                    disabled={isGoogleSignInInProgress}
                    accessibilityRole="button"
                    accessibilityLabel="Continue with Google"
                  >
                    {isGoogleSignInInProgress ? (
                      <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                      <GoogleIcon width={24} height={24} color="#0F5270" />
                    )}
                  </TouchableOpacity>
                  <View style={styles.socialCircle}>
                    <FacebookIcon width={24} height={24} color="#0F5270" />
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.footerRow}>
              <UvTypography variant="body" color="#CFE2EA">
                Don't have an account?
              </UvTypography>
              <TouchableOpacity
                onPress={() => navigation.navigate("RegisterScreen")}
              >
                <UvTypography variant="p" color={Colors.white}>
                  Register Here
                </UvTypography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </UvScreenWrapper>
  );
};

export default LoginScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topLogo: {
    alignSelf: "center",
    width: 52,
    height: 40,
    marginBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  form: {
    flex: 1,
    justifyContent: "space-between",
  },
  formContent: {
    flex: 1,
  },
  inputWrapper: {},
  input: {},
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: 24,
  },
  orRow: {
    marginTop: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#91B4C3",
  },
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
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    paddingBottom: 24,
  },
});
