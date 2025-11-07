import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvStreak from "../../components/common/uvStreak";
import UvQuickStats from "../../components/common/uvQuickStats";
import UvPreferences from "../../components/common/uvPreferences";
import UvProfileHeader from "../../components/common/uvProfileHeader";
import UvHeader from "../../components/common/uvHeader";
import UvSpacer from "../../components/common/uvSpacer";
import { useAppDispatch } from "../../store/store";
import { resetBackendApiState } from "../../services/backendBaseApi";
import { authApi } from "../../services/authRequest/authApi";

const ProfileScreen = () => {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await AsyncStorage.removeItem("UserToken");
      dispatch(resetBackendApiState());
      dispatch(authApi.util.resetApiState());

      navigation.reset({
        index: 0,
        routes: [
          {
            name: "AuthStack",
            params: {
              screen: "LoginScreen",
            },
          },
        ],
      });
    } catch (error) {
      console.log("logout error", error);
      Alert.alert("Logout failed", "Unable to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };
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
            onEditPress={() => navigation.navigate("EditProfileScreen")}
          />

          <UvSpacer gap={15} />
          <UvStreak />

          <UvSpacer gap={15} />
          <UvQuickStats />

          <UvSpacer gap={15} />
          <UvPreferences
            locationEnabled={locationEnabled}
            onToggle={setLocationEnabled}
            onLogout={handleLogout}
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

