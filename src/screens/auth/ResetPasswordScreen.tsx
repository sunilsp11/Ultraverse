import React, { useState } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import UvButton from "../../components/common/uvButton";
import UvFormTextInput from "../../components/common/uvFormTextInput";
import UvTypography from "../../components/common/uvTypography";
import Colors from "../../theme/color";

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = () => {
    // onReset && onReset({ newPassword, confirmPassword });
  };

  return (
    <LinearGradient
      colors={["#05273A", "#0F5270"]}
      start={{ x: 0.5, y: 0.0 }}
      end={{ x: 0.5, y: 1.0 }}
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/top_header_logo.png")}
          style={styles.topLogo}
          resizeMode="contain"
        />
        <UvTypography variant="h3" align="center">
          RESET PASSWORD
        </UvTypography>
      </View>

      <View style={styles.form}>
        <UvTypography
          variant="h6"
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

        <View style={{ height: 16 }} />

        <UvTypography
          variant="h6"
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

        <View style={{ height: 32 }} />

        <UvButton onPress={handleReset} title="Reset Password" />
      </View>
    </LinearGradient>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
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
