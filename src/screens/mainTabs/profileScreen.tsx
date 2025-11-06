import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvStreak from "../../components/common/uvStreak";
import UvQuickStats from "../../components/common/uvQuickStats";
import UvPreferences from "../../components/common/uvPreferences";
import UvProfileHeader from "../../components/common/uvProfileHeader";
import UvHeader from "../../components/common/uvHeader";
import UvSpacer from "../../components/common/uvSpacer";

const ProfileScreen = () => {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const navigation = useNavigation();
  return (
    <UvScreenWrapper>
      <UvHeader
        title="PROFILE"
        titleVariant="h4"
        containerStyle={styles.headerContainer}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View style={styles.container}>
          <UvSpacer gap={15} />
          <UvProfileHeader
            avatarSource={require("../../assets/images/Fortnite.png")}
            name="MIKE SMITH"
            email="mike_smith@mail.com"
            onEditPress={() => navigation.navigate('EditProfileScreen' as never)}
          />

          <UvSpacer gap={15} />
          <UvStreak />

          <UvSpacer gap={15} />
          <UvQuickStats />

          <UvSpacer gap={15} />
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

