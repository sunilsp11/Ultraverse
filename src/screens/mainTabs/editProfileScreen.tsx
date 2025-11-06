import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvTypography from "../../components/common/uvTypography";
import UvFormTextInput from "../../components/common/uvFormTextInput";
import Colors from "../../theme/color";
import UvProfileHeader from "../../components/common/uvProfileHeader";
import UvButton from "../../components/common/uvButton";
import SaveIcon from "../../assets/svg/save.svg";
import CameraIcon from "../../assets/svg/cameraIcon.svg";
import UvHeader from "../../components/common/uvHeader";

const EditProfileScreen = () => {
  const [name, setName] = useState("Mike Smith");
  const [email, setEmail] = useState("mike_smith@mail.com");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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


