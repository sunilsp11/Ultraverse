import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import LinearGradient from "react-native-linear-gradient";
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

const RegisterScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      // Handle password mismatch
      return;
    }
    // onRegister && onRegister({ name, email, password });
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
          <UvFormTextInput
            placeholder="Please enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            variant="body"
          />

          <View style={{ height: 16 }} />

          <UvTypography
            variant="h6"
            color={Colors.white}
            style={{ marginBottom: 8 }}
          >
            EMAIL
          </UvTypography>
          <UvFormTextInput
            placeholder="Please enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            variant="body"
          />

          <View style={{ height: 16 }} />

          <UvTypography
            variant="h6"
            color={Colors.white}
            style={{ marginBottom: 8 }}
          >
            CREATE PASSWORD
          </UvTypography>
          <UvFormTextInput
            placeholder="Please create password"
            value={password}
            onChangeText={setPassword}
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
            CONFIRM PASSWORD
          </UvTypography>
          <UvFormTextInput
            placeholder="Please confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            showPasswordToggle={true}
            autoCapitalize="none"
            variant="body"
          />

          <View style={{ height: 16 }} />

          <UvButton onPress={handleRegister} title="Register" />

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
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    paddingBottom: 24,
  },
});
