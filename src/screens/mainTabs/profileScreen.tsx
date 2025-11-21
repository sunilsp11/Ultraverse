import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvStreak from "../../components/common/uvStreak";
import UvQuickStats from "../../components/common/uvQuickStats";
import UvPreferences from "../../components/common/uvPreferences";
import UvProfileHeader from "../../components/common/uvProfileHeader";
import UvHeader from "../../components/common/uvHeader";
import UvSpacer from "../../components/common/uvSpacer";
import UvLocationToggleModal from "../../components/common/uvLocationToggleModal";
import {
  requestLocationPermission,
  getCurrentLocation,
  formatCoordinate,
  getErrorMessage,
} from "../../components/common/uvLocationService";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { resetBackendApiState } from "../../services/backendBaseApi";
import { authApi } from "../../services/authRequest/authApi";
import {
  useGetProfileQuery,
  useUpdateLocationMutation,
} from "../../services/profile/profileApi";
import { clearProfile } from "../../store/slices/profileSlice";

const defaultAvatar = require("../../assets/images/Fortnite.png");

const ProfileScreen = () => {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hasShownErrorAlert, setHasShownErrorAlert] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const storedProfile = useAppSelector((state) => state.profile.profile);
  const profileProvider = useAppSelector((state) => state.profile.provider);
  const {
    data: profile,
    isFetching,
    isLoading,
    refetch,
    error,
  } = useGetProfileQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    skip: profileProvider === "google",
  });
  const [updateLocation] = useUpdateLocationMutation();

  useEffect(() => {
    if (!error) {
      setHasShownErrorAlert(false);
      return;
    }

    if (hasShownErrorAlert) {
      return;
    }

    const errorData = (error as { data?: { message?: string; detail?: string } }).data;
    const message =
      errorData?.message ||
      errorData?.detail ||
      "Unable to load your profile. Please pull to refresh and try again.";

    Alert.alert("Profile", message);
    setHasShownErrorAlert(true);
  }, [error, hasShownErrorAlert]);

  const activeProfile = profile ?? storedProfile ?? null;

  const displayName = useMemo(() => {
    const name = activeProfile?.first_name || activeProfile?.username || "";
    return name ? name.toUpperCase() : "GAMER";
  }, [activeProfile?.first_name, activeProfile?.username]);

  const displayEmail = useMemo(() => {
    return activeProfile?.email || activeProfile?.username || "";
  }, [activeProfile?.email, activeProfile?.username]);

  const avatarSource = useMemo(() => {
    if (activeProfile?.profile_picture_url) {
      return { uri: activeProfile.profile_picture_url };
    }

    return defaultAvatar;
  }, [activeProfile?.profile_picture_url]);


  const handleLocationToggle = async (value: boolean) => {
    if (isUpdatingLocation) {
      return;
    }

    if (value === locationEnabled) {
      return;
    }

    setIsUpdatingLocation(true);
    
    try {
      if (value) {
        const hasPermission = await requestLocationPermission();
        
        if (!hasPermission) {
          setIsUpdatingLocation(false);
          Alert.alert(
            "Permission Denied",
            "Location permission is required to enable location services.",
            [
              {
                text: "OK",
              },
            ]
          );
          return;
        }

        try {
          const location = await getCurrentLocation();
       
         const response = await updateLocation({
            latitude: formatCoordinate(location.latitude),
            longitude: formatCoordinate(location.longitude),
            address: location.address || "string",
            location_permission_enabled: true,
          }).unwrap();
          
          setLocationEnabled(true);
          setShowLocationModal(true);
          setIsUpdatingLocation(false);
        } catch (error: any) {
       
          setIsUpdatingLocation(false);
          
          const { title, message } = getErrorMessage(error);

          Alert.alert(
            title,
            message,
            [
              {
                text: "OK",
              },
            ]
          );
          return;
        }
      } else {
        try {
          await updateLocation({
            location_permission_enabled: false,
          }).unwrap();

          setLocationEnabled(false);
          setShowLocationModal(true);
          setIsUpdatingLocation(false);
        } catch (error: any) {
          setIsUpdatingLocation(false);
          
          const errorMessage =
            error?.data?.message ||
            error?.data?.detail ||
            "Failed to update location. Please try again.";
          
          Alert.alert("Error", errorMessage, [
            {
              text: "OK",
            },
          ]);
          
          setLocationEnabled(true);
          return;
        }
      }
    } catch (error: any) {
      setIsUpdatingLocation(false);
      
      const errorMessage =
        error?.data?.message ||
        error?.data?.detail ||
        "Failed to update location. Please try again.";
      
      Alert.alert("Error", errorMessage, [
        {
          text: "OK",
        },
      ]);
      
        if (value) {
        setLocationEnabled(false);
      } else {
        setLocationEnabled(true);
      }
    }
  };

  const handleCloseLocationModal = () => {
    setShowLocationModal(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await AsyncStorage.removeItem("UserToken");
      await AsyncStorage.removeItem("UserAccessToken");
      await AsyncStorage.removeItem("UserRefreshToken");
      dispatch(resetBackendApiState());
      dispatch(authApi.util.resetApiState());
      dispatch(clearProfile());

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
        refreshControl={
          <RefreshControl refreshing={isFetching || (isLoading && !profile)} onRefresh={refetch} />
        }
      >
        <View style={styles.container}>
          <UvSpacer gap={15} />
          <UvProfileHeader
            avatarSource={avatarSource}
            name={displayName}
            email={displayEmail}
            onEditPress={() => navigation.navigate("EditProfileScreen")}
            editIcon={true}
          />

          <UvSpacer gap={15} />
          <UvStreak />

          <UvSpacer gap={15} />
          <UvQuickStats />

          <UvSpacer gap={15} />
          <UvPreferences
            locationEnabled={locationEnabled}
            onToggle={handleLocationToggle}
            onLogout={handleLogout}
            isUpdatingLocation={isUpdatingLocation}
          />
        </View>
      </ScrollView>

      <UvLocationToggleModal
        visible={showLocationModal}
        isLocationEnabled={locationEnabled}
        onClose={handleCloseLocationModal}
      />
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

