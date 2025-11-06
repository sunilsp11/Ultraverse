import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import UvButton from "../../components/common/uvButton";
import UvFormTextInput from "../../components/common/uvFormTextInput";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvTypography from "../../components/common/uvTypography";
import Colors from "../../theme/color";
import UvSpacer from "../../components/common/uvSpacer";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types/navigationTypes";

type ResetPasswordScreenRouteProp = NativeStackScreenProps<
  AuthStackParamList,
  "ResetPasswordScreen"
>["route"];

const ResetPasswordScreen = () => {
  const route = useRoute<ResetPasswordScreenRouteProp>();
  const { email } = route.params;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleReset = () => {
    
  };

  return (
    <UvScreenWrapper inverted={true} conatinerStyle={styles.container}>
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
        <UvFormTextInput
          placeholder="Please enter your OTP"
          value={otp}
          onChangeText={setOtp}
          autoCapitalize="none"
          variant="body"
          keyboardType="numeric"
        />

        <UvSpacer gap={8} />

        <UvTypography
          variant="h7"
          color={Colors.white}
          style={{ marginBottom: 8 }}
        >
          NEW PASSWORD
        </UvTypography>
        <UvFormTextInput
          placeholder="Please enter your new password"
          value={newPassword}
          onChangeText={setNewPassword}
          showPasswordToggle={true}
          autoCapitalize="none"
          variant="body"
        />

        <UvSpacer gap={8} />

        <UvTypography
          variant="h7"
          color={Colors.white}
          style={{ marginBottom: 8 }}
        >
          CONFIRM NEW PASSWORD
        </UvTypography>
        <UvFormTextInput
          placeholder="Please confirm your new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          showPasswordToggle={true}
          autoCapitalize="none"
          variant="body"
        />

        <UvSpacer gap={20} />

        <UvButton onPress={handleReset} title="Reset Password" />
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
