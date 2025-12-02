import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import UvButton from "../../components/common/uvButton";
import UvFormTextInput from "../../components/common/uvFormTextInput";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvTypography from "../../components/common/uvTypography";
import Colors from "../../theme/color";
import { AuthStackParamList } from "../../types/navigationTypes";
import { useForm, Controller } from "react-hook-form";
import { useForgotPasswordMutation } from "../../services/authRequest/authApi";

const ForgotPasswordScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  type ForgotFormData = { email: string };
  const { control, handleSubmit, formState: { errors } } = useForm<ForgotFormData>({
    defaultValues: { email: "sunilp.brainerhub@gmail.com" },
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotFormData) => {
    if (isLoading) return;
    try {
      await forgotPassword({ email: data.email }).unwrap();
      Alert.alert("Email sent", "Please check your email for reset instructions");
      navigation.navigate("ResetPasswordScreen", { email: data.email });
    } catch (error: any) {
      Alert.alert(
        "Request failed",
        error?.data?.message || "Please try again"
      );
    }
  };

  return (
    <UvScreenWrapper inverted={true} conatinerStyle={styles.container} isScrollable={true}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/top_header_logo.png")}
          style={styles.topLogo}
          resizeMode="contain"
        />
        <UvTypography variant="h3" align="center">
          FORGOT PASSWORD?
        </UvTypography>
        <View style={{ height: 8 }} />
        <UvTypography variant="p" color="#D7E7EE" align="center">
          Enter your email below and we'll send you a link to reset your
          password.
        </UvTypography>
      </View>

      <View style={styles.form}>
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
            validate: v => (!!v && v.trim().length > 0) || "Email is required",
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

        <View style={{ height: 32 }} />

        <UvButton onPress={handleSubmit(onSubmit)} title="Submit" />

        <View style={{ height: 24 }} />
        <View style={styles.footerRow}>
          <UvTypography variant="body" color="#CFE2EA">
            Remember Password?
          </UvTypography>
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <UvTypography variant="p" color={Colors.white}>
              {" "}
              Login Here
            </UvTypography>
          </TouchableOpacity>
        </View>
      </View>
    </UvScreenWrapper>
  );
};

export default ForgotPasswordScreen;

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
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
