import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import { TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import UvButton from "../../components/common/uvButton";
import UvFormTextInput from "../../components/common/uvFormTextInput";
import UvTypography from "../../components/common/uvTypography";
import Colors from "../../theme/color";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types/navigationTypes";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import GoogleIcon from "../../assets/svg/google.svg";
import FacebookIcon from "../../assets/svg/facebook.svg";
import { useRegisterMutation } from "../../services/authRequest/authApi";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [registerMutation, { isLoading }] = useRegisterMutation();
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    if (isLoading) return;
    try {
      let body = {
        "name": data.name,
        "email": data.email,
        "password": data.password,
      }
      const response = await registerMutation(body).unwrap();
      console.log("response", response);
      Alert.alert("Registration successful", "Please login to your account");
      navigation.navigate("LoginScreen");
    } catch (error: any) {
      console.log("Registration error:", error);
      let errorMessage = "Please try again";
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (error?.status === 'FETCH_ERROR' || error?.status === 'TIMEOUT_ERROR') {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      Alert.alert(
        "Registration failed",
        errorMessage
      );
    }
  };

  return (
    <UvScreenWrapper inverted={true} conatinerStyle={styles.container} isScrollable={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ paddingHorizontal: 24, flex: 1 }}>
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/top_header_logo.png")}
              style={styles.topLogo}
              resizeMode="contain"
            />
            <UvTypography variant="h3" align="center">
              REGISTER
            </UvTypography>
            <View style={{ height: 8 }} />
            <UvTypography variant="p" color="#D7E7EE" align="center">
              Enter your information below to create your account.
            </UvTypography>
          </View>

          <View style={styles.form}>
            <ScrollView showsVerticalScrollIndicator={false} automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps="handled">
              <View style={styles.formContent}>
                <UvTypography
                  variant="h6"
                  color={Colors.white}
                  style={{ marginBottom: 8 }}
                >
                  NAME
                </UvTypography>
                <Controller
                  control={control}
                  name="name"
                  rules={{
                    required: "Name is required",
                    minLength: { value: 3, message: "Name must be at least 3 characters" },
                    validate: (v) => (!!v && v.trim().length > 0) || "Name is required",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <UvFormTextInput
                        placeholder="Please enter your full name"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="words"
                        variant="body"
                      />
                      {errors.name && (
                        <UvTypography
                          variant="bodyXs"
                          color={Colors.danger[400]}
                        >
                          {errors.name.message}
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
                    validate: (v) => (!!v && v.trim().length > 0) || "Email is required",
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
                  CREATE PASSWORD
                </UvTypography>
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                    validate: {
                      hasUpper: (v) => /[A-Z]/.test(v) || "Include at least one uppercase letter",
                      hasLower: (v) => /[a-z]/.test(v) || "Include at least one lowercase letter",
                      hasNum: (v) => /[0-9]/.test(v) || "Include at least one number",
                      hasSpecial: (v) => /[!@#$%^&*(),.?":{}|<>\[\]_+=\-]/.test(v) || "Include at least one special character",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <UvFormTextInput
                        placeholder="Please create password"
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

                <View style={{ height: 16 }} />

                <UvTypography
                  variant="h6"
                  color={Colors.white}
                  style={{ marginBottom: 8 }}
                >
                  CONFIRM PASSWORD
                </UvTypography>
                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{
                    required: "Please confirm your password",
                    validate: (v) => v === password || "Passwords do not match",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <UvFormTextInput
                        placeholder="Please confirm password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        showPasswordToggle={true}
                        autoCapitalize="none"
                        variant="body"
                      />
                      {errors.confirmPassword && (
                        <UvTypography
                          variant="bodyXs"
                          color={Colors.danger[400]}
                        >
                          {errors.confirmPassword.message}
                        </UvTypography>
                      )}
                    </>
                  )}
                />

                <View style={{ height: 16 }} />

                <UvButton
                  onPress={handleSubmit(onSubmit)}
                  title="Register"
                />

                <View style={styles.orRow}>
                  <View style={styles.divider} />
                  <UvTypography variant="bodyXs" color="#CFE2EA">
                    or continue with
                  </UvTypography>
                  <View style={styles.divider} />
                </View>

                <View style={styles.socialRow}>
                  <View style={styles.socialCircle}>
                    <GoogleIcon width={24} height={24} color="#0F5270" />
                  </View>
                  <View style={styles.socialCircle}>
                    <FacebookIcon width={24} height={24} color="#0F5270" />
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={styles.termsContainer}>
              <UvTypography variant="bodyXs" color="#CFE2EA" align="center">
                By continuing, you agree to our{" "}
              </UvTypography>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL("https://ultraverse.games/privacy-policy/")
                }
                activeOpacity={0.7}
              >
                <UvTypography variant="bodyXs" color={Colors.white} style={{ textDecorationLine: 'underline' }}>
                  Terms and conditions
                </UvTypography>
              </TouchableOpacity>
            </View>
            <View style={styles.footerRow}>
              <UvTypography variant="body" color="#CFE2EA">
                Already have an account?
              </UvTypography>
              <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                <UvTypography variant="p" color={Colors.white}>
                  {" "}
                  Login Here
                </UvTypography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </UvScreenWrapper>
  );
};

export default RegisterScreen;

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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    paddingBottom: 24,
  },
});
