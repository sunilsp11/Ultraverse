import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvTypography from "../../components/common/uvTypography";
import UvFormTextInput from "../../components/common/uvFormTextInput";
import Colors from "../../theme/color";
import UvProfileHeader from "../../components/common/uvProfileHeader";
import UvButton from "../../components/common/uvButton";
import SaveIcon from "../../assets/svg/save.svg";
import CameraIcon from "../../assets/svg/cameraIcon.svg";
import UvHeader from "../../components/common/uvHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Controller, useForm } from "react-hook-form";
import { useChangePasswordMutation } from "../../services/authRequest/authApi";

const EditProfileScreen = () => {
  const [name, setName] = useState("Mike Smith");
  const [email, setEmail] = useState("mike_smith@mail.com");
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  type ChangePasswordFormData = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };

  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const newPasswordValue = watch("newPassword");

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (isLoading) return;

    const token = await AsyncStorage.getItem("UserToken");

    if (!token) {
      Alert.alert("Unable to change password", "User session not found. Please login again.");
      return;
    }

    try {
      clearErrors("oldPassword");

      await changePassword({
        token,
        old_password: data.oldPassword,
        new_password: data.newPassword,
      }).unwrap();

      Alert.alert("Password updated", "Your password has been changed successfully.");
      reset();
    } catch (error: any) {
      const oldPasswordError = error?.data?.old_password?.[0];

      if (oldPasswordError) {
        setError("oldPassword", {
          type: "server",
          message: oldPasswordError,
        });
      }

      if (!oldPasswordError) {
        Alert.alert(
          "Password update failed",
          error?.data?.message || "Please verify your current password and try again."
        );
      }
    }
  };

  return (
    <UvScreenWrapper>
      <View style={styles.container}>
        <UvHeader 
          title="EDIT PROFILE" 
          titleVariant="h4"
          containerStyle={styles.headerContainer}
        />

        <View style={{ height: 51 }} />
        <ScrollView showsVerticalScrollIndicator={false} automaticallyAdjustKeyboardInsets={true} style={styles.scrollView}>
          <UvProfileHeader
            avatarSource={require("../../assets/images/Fortnite.png")}
            name={name.toUpperCase()}
            email={email}
            onEditPress={() => console.log('Edit avatar pressed')}
            editIcon={<CameraIcon width={32} height={32} color={Colors.black} />}
          />

          <View style={{ height: 32 }} />

          <UvTypography variant="h7" color={Colors.base[50]} style={styles.sectionTitle}>
            PERSONAL INFO
          </UvTypography>
          <View style={{ height: 12 }} />
          <UvFormTextInput value={name} onChangeText={setName} placeholder="Mike Smith" />
          <View style={{ height: 12 }} />
          <UvFormTextInput value={email} onChangeText={setEmail} placeholder="mike_smith@mail.com" keyboardType="email-address" />

          <View style={{ height: 32 }} />

          <UvTypography variant="h7" color={Colors.base[50]} style={styles.sectionTitle}>
            CHANGE PASSWORD
          </UvTypography>
          <View style={{ height: 12 }} />
          <View style={{paddingBottom: 32}}>
            <Controller
              control={control}
              name="oldPassword"
              rules={{
                required: "Current password is required",
                validate: v => (!!v && v.trim().length > 0) || "Current password is required",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <UvFormTextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter current password"
                    showPasswordToggle
                    autoCapitalize="none"
                  />
                  {errors.oldPassword && (
                    <UvTypography variant="bodyXs" color={Colors.danger[400]}>
                      {errors.oldPassword.message}
                    </UvTypography>
                  )}
                </>
              )}
            />

            <View style={{ height: 12 }} />

            <Controller
              control={control}
              name="newPassword"
              rules={{
                required: "New password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
                validate: {
                  hasUpper: v => /[A-Z]/.test(v) || "Include at least one uppercase letter",
                  hasLower: v => /[a-z]/.test(v) || "Include at least one lowercase letter",
                  hasNum: v => /[0-9]/.test(v) || "Include at least one number",
                  hasSpecial: v => /[!@#$%^&*(),.?":{}|<>\[\]_+=\-]/.test(v) || "Include at least one special character",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <UvFormTextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Create new password"
                    showPasswordToggle
                    autoCapitalize="none"
                  />
                  {errors.newPassword && (
                    <UvTypography variant="bodyXs" color={Colors.danger[400]}>
                      {errors.newPassword.message}
                    </UvTypography>
                  )}
                </>
              )}
            />

            <View style={{ height: 12 }} />

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your new password",
                validate: v => v === newPasswordValue || "Passwords do not match",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <UvFormTextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Confirm new password"
                    showPasswordToggle
                    autoCapitalize="none"
                  />
                  {errors.confirmPassword && (
                    <UvTypography variant="bodyXs" color={Colors.danger[400]}>
                      {errors.confirmPassword.message}
                    </UvTypography>
                  )}
                </>
              )}
            />
          </View>
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <UvButton
            title="Save"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            icon={<SaveIcon width={20} height={20} color={Colors.base[950]} />}
            iconPosition="left"
          />
        </View>
      </View>
    </UvScreenWrapper>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    letterSpacing: 2,
  },

  bottomButtonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 10,
  }
});


