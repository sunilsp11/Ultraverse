import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvTypography from "../../components/common/uvTypography";
import UvFormTextInput from "../../components/common/uvFormTextInput";
import Colors from "../../theme/color";
import BackArrowIcon from "../../assets/svg/backArrow.svg";
import UvProfileHeader from "../../components/common/uvProfileHeader";
import UvButton from "../../components/common/uvButton";
import SaveIcon from "../../assets/svg/save.svg";
import CameraIcon from "../../assets/svg/cameraIcon.svg";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("Mike Smith");
  const [email, setEmail] = useState("mike_smith@mail.com");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <UvScreenWrapper>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <BackArrowIcon width={20} height={20} color={Colors.black} />
          </TouchableOpacity>
          <UvTypography variant="h6" align="center" color={Colors.white}>
            EDIT PROFILE
          </UvTypography>
        </View>

        <View style={{ height: 51 }} />
        <ScrollView showsVerticalScrollIndicator={false} automaticallyAdjustKeyboardInsets={true}>
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
          <UvFormTextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Create new password"
            showPasswordToggle
          />
          <View style={{ height: 12 }} />
          <UvFormTextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            showPasswordToggle
          />
          </View>
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <UvButton
            title="Save"
            onPress={() => console.log('Save pressed')}
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
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  backButton: {
    backgroundColor: 'white',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
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


