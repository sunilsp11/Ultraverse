import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import UvButton from "../../components/common/uvButton";
import UvFormTextInput from "../../components/common/uvFormTextInput";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvSocialLogins from "../../components/common/uvSocialLogins";
import UvTypography from "../../components/common/uvTypography";
import {
  useLoginMutation
} from "../../services/authRequest/authApi";
import {
  setAuthProvider
} from "../../store/slices/profileSlice";
import { useAppDispatch } from "../../store/store";
import Colors from "../../theme/color";
import {
  AuthStackParamList,
  RootStackParamList,
} from "../../types/navigationTypes";

export enum LoginProvider {
  google = "google-oauth2",
  facebook = "facebook",
}

const LoginScreen = () => {
  type LoginNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<AuthStackParamList, "LoginScreen">,
    NativeStackNavigationProp<RootStackParamList>
  >;

  const navigation = useNavigation<LoginNavigationProp>();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const [globalErrorMessage, setGlobalErrorMessage] = useState<string | null>(null);

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
      email: __DEV__ ? "admin@gmail.com" : "",
      password: __DEV__ ? "admin" : "",
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
      console.log("response", JSON.stringify(response, null, 2));
      const token = response?.tokens?.access;
      const refreshToken = response?.tokens?.refresh;
      console.log("refreshToken", refreshToken);
      
      if (token) {
        await AsyncStorage.setItem("UserToken", token);
        await AsyncStorage.setItem("UserRefreshToken", refreshToken);
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
      console.log("error", JSON.stringify(error, null, 2));
      setGlobalErrorMessage(error?.data?.message || "Please check your credentials and try again");
      // Alert.alert(
      //   "Login failed",
      //   error?.data?.message || "Please check your credentials and try again"
      // );
    }
  };

  return (
    <UvScreenWrapper inverted={true} conatinerStyle={styles.container} isScrollable={true} isLoading={isLoading}>
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

                {globalErrorMessage && (
                  <UvTypography variant="bodyXs" color={Colors.danger[400]}>
                    {globalErrorMessage}
                  </UvTypography>
                )}

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

                <UvSocialLogins />
              </View>

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
