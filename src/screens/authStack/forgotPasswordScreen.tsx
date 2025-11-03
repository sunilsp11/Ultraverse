import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import UvTypography from "../../components/common/uvTypography";
import Colors from "../../theme/color";
import UvFormTextInput from "../../components/common/uvFormTextInput";
import UvButton from "../../components/common/uvButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types/navigationTypes";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";

const ForgotPasswordScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    navigation.navigate("ResetPasswordScreen");
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
        <UvFormTextInput
          placeholder="Please enter your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          variant="body"
        />

        <View style={{ height: 32 }} />

        <UvButton onPress={handleSubmit} title="Submit" />

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
