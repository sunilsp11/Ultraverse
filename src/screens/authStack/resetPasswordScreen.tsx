import React from "react";
import { Image, StyleSheet, View, Alert } from "react-native";
import UvButton from "../../components/common/uvButton";
import UvFormTextInput from "../../components/common/uvFormTextInput";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvTypography from "../../components/common/uvTypography";
import Colors from "../../theme/color";
import UvSpacer from "../../components/common/uvSpacer";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types/navigationTypes";
import { useForm, Controller } from "react-hook-form";
import { useResetPasswordMutation } from "../../services/authRequest/authApi";

type ResetPasswordScreenRouteProp = NativeStackScreenProps<
  AuthStackParamList,
  "ResetPasswordScreen"
>["route"];

type ResetPasswordFormValues = {
  otp_code: string;
  new_password: string;
  confirm_password: string;
};

const ResetPasswordScreen = () => {
  const route = useRoute<ResetPasswordScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { email } = route.params;
  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      otp_code: "",
      new_password: "",
      confirm_password: "",
    },
  });
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleReset = async (values: ResetPasswordFormValues) => {
    if (isLoading) return;
    try {
      await resetPassword({
        email,
        otp_code: values.otp_code,
        new_password: values.new_password,
      }).unwrap();
      Alert.alert("Password Reset Successful", "Your password has been reset successfully. Please login with your new password.");
      navigation.navigate("LoginScreen");
    } catch (error: any) {
      Alert.alert(
        "Reset Failed",
        error?.data?.message || "Please check your OTP and try again"
      );
    }
  };

  return (
    <UvScreenWrapper inverted={true} conatinerStyle={styles.container} isScrollable={true} isLoading={isLoading} >
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/top_header_logo.png")}
          style={styles.topLogo}
          resizeMode="contain"
        />
        <UvTypography variant="h3" align="center">
          RESET PASSWORD
        </UvTypography>
        <View style={{ height: 8 }} />
        <UvTypography variant="p" color="#D7E7EE" align="center">
          Sent OTP to {email}
        </UvTypography>
      </View>

      <View style={styles.form}>

      <UvTypography
          variant="h7"
          color={Colors.white}
          style={{ marginBottom: 8 }}
        >
          OTP
        </UvTypography>
        <Controller
          control={control}
          name="otp_code"
          rules={{ required: "OTP is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <UvFormTextInput
              placeholder="Please enter your OTP"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              variant="body"
              keyboardType="numeric"
            />
          )}
        />
        {errors.otp_code && (
          <UvTypography variant="bodyXs" color="#FF6B6B" style={{ marginTop: 6 }}>
            {errors.otp_code.message}
          </UvTypography>
        )}

        <UvSpacer gap={8} />

        <UvTypography
          variant="h7"
          color={Colors.white}
          style={{ marginBottom: 8 }}
        >
          NEW PASSWORD
        </UvTypography>
        <Controller
          control={control}
          name="new_password"
          rules={{
            required: "New password is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <UvFormTextInput
              placeholder="Please enter your new password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              showPasswordToggle={true}
              autoCapitalize="none"
              variant="body"
            />
          )}
        />
        {errors.new_password && (
          <UvTypography variant="bodyXs" color="#FF6B6B" style={{ marginTop: 6 }}>
            {errors.new_password.message}
          </UvTypography>
        )}

        <UvSpacer gap={8} />

        <UvTypography
          variant="h7"
          color={Colors.white}
          style={{ marginBottom: 8 }}
        >
          CONFIRM NEW PASSWORD
        </UvTypography>
        <Controller
          control={control}
          name="confirm_password"
          rules={{
            required: "Confirm your new password",
            validate: value => value === watch("new_password") || "Passwords do not match",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <UvFormTextInput
              placeholder="Please confirm your new password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              showPasswordToggle={true}
              autoCapitalize="none"
              variant="body"
            />
          )}
        />
        {errors.confirm_password && (
          <UvTypography variant="bodyXs" color="#FF6B6B" style={{ marginTop: 6 }}>
            {errors.confirm_password.message}
          </UvTypography>
        )}

        <UvSpacer gap={20} />

        <UvButton onPress={handleSubmit(handleReset)} title={isLoading ? "Please wait..." : "Reset Password"} />
      </View>
    </UvScreenWrapper>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
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
  },
});
