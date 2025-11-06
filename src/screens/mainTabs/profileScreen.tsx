import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvStreak from "../../components/common/uvStreak";
import UvQuickStats from "../../components/common/uvQuickStats";
import UvPreferences from "../../components/common/uvPreferences";
import UvProfileHeader from "../../components/common/uvProfileHeader";
import UvHeader from "../../components/common/uvHeader";
const ProfileScreen = () => {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const navigation = useNavigation();
  return (
    <UvScreenWrapper>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.container}>
          <UvHeader 
            title="PROFILE" 
            titleVariant="h4"
            containerStyle={styles.headerContainer}
          />

          <View style={{ height: 24 }} />

          <UvProfileHeader
            avatarSource={require("../../assets/images/Fortnite.png")}
            name="MIKE SMITH"
            email="mike_smith@mail.com"
            onEditPress={() => navigation.navigate('EditProfileScreen' as never)}
          />


          <View style={{ height: 24 }} />
          <UvStreak />

          <View style={{ height: 32 }} />
          <UvQuickStats />

          <View style={{ height: 32 }} />

          <UvPreferences
            locationEnabled={locationEnabled}
            onToggle={setLocationEnabled}
          />
        </View>
      </ScrollView>
    </UvScreenWrapper>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
  },
});

