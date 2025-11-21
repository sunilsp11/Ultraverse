import React, { useCallback, useMemo } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList, Alert } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import UvTypography from "./uvTypography";
import UvToggleSwitch from "./uvToggleSwitch";
import Colors from "../../theme/color";
import AlertIcon from "../../assets/svg/alert.svg";
import RatingStarIcon from "../../assets/svg/ratingStar.svg";
import TranslateIcon from "../../assets/svg/translateIcon.svg";
import LocationIcon from "../../assets/svg/location.svg";
import SignoutIcon from "../../assets/svg/signoutIcon.svg";
import { AuthStackParamList } from "../../types/navigationTypes";
import { useLazyGetUserPlatformFeedbackQuery } from "../../services/feedback/platformFeedbackApi";

type UvPreferencesProps = {
  locationEnabled: boolean;
  onToggle: (value: boolean) => void;
  onLogout?: () => void;
  isUpdatingLocation?: boolean;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

type PreferenceItemType = 'navigation' | 'toggle' | 'action';

interface PreferenceItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ width: number; height: number; color: string }>;
  type: PreferenceItemType;
  onPress?: () => void;
  showDivider?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  disabled?: boolean;
}

const UvPreferences = ({ locationEnabled, onToggle, onLogout, isUpdatingLocation = false }: UvPreferencesProps) => {
  const navigation = useNavigation<NavigationProp>();
  const [fetchUserPlatformFeedback, { isFetching: isCheckingExistingFeedback }] = useLazyGetUserPlatformFeedbackQuery();

  const handlePlatformFeedbackPress = useCallback(async () => {
    if (isCheckingExistingFeedback) {
      return;
    }

    try {
      const existingFeedback = await fetchUserPlatformFeedback().unwrap();

      if (Array.isArray(existingFeedback) && existingFeedback.length > 0) {
        Alert.alert(
          'Feedback Already Submitted',
          'You have already submitted platform feedback.',
        );
        return;
      }
    } catch (error) {
      console.error('Unable to verify existing platform feedback', error);
    }

    navigation.navigate('PlatformFeedbackScreen' as never);
  }, [fetchUserPlatformFeedback, isCheckingExistingFeedback, navigation]);

  const handleLogOutPress = useCallback(() => {
    if (onLogout) {
      onLogout();
      return;
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'AuthStack' as never,
            params: { screen: 'LoginScreen' } as never,
          } as never,
        ],
      })
    );
  }, [navigation, onLogout]);

  const preferenceItems: PreferenceItem[] = useMemo(() => [
    {
      id: 'platform-feedback',
      label: 'Platform Feedback',
      icon: RatingStarIcon,
      type: 'navigation',
      onPress: handlePlatformFeedbackPress,
    },
    {
      id: 'notification-settings',
      label: 'Notification Settings',
      icon: AlertIcon,
      type: 'navigation',
      showDivider: true,
    },
    {
      id: 'language',
      label: 'Language',
      icon: TranslateIcon,
      type: 'navigation',
      showDivider: true,
    },
    {
      id: 'location-permissions',
      label: 'Location Permissions',
      icon: LocationIcon,
      type: 'toggle',
      toggleValue: locationEnabled,
      onToggle: onToggle,
      showDivider: true,
      disabled: isUpdatingLocation,
    },
    {
      id: 'logout',
      label: 'Log Out',
      icon: SignoutIcon,
      type: 'action',
      onPress: handleLogOutPress,
    },
  ], [handleLogOutPress, handlePlatformFeedbackPress, locationEnabled, onToggle, isUpdatingLocation]);

  const renderPreferenceItem = ({ item }: { item: PreferenceItem }) => {
    const IconComponent = item.icon;

    if (item.type === 'toggle') {
      return (
        <View style={styles.prefItem}>
          <IconComponent width={24} height={24} color={Colors.white} />
          <UvTypography variant="body" color={Colors.white} style={styles.prefLabel}>
            {item.label}
          </UvTypography>
          <View style={{ flex: 1 }} />
          <UvToggleSwitch
            value={item.toggleValue || false}
            onValueChange={item.onToggle || (() => {})}
            activeColor={Colors.primary[500]}
            inactiveColor={Colors.base[700]}
            thumbColor={Colors.black}
            disabled={item.disabled || false}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.prefItem} onPress={item.onPress}>
        <IconComponent width={24} height={24} color={Colors.white} />
        <UvTypography variant="body" color={Colors.white} style={styles.prefLabel}>
          {item.label}
        </UvTypography>
      </TouchableOpacity>
    );
  };

  const renderSeparator = ({ leadingItem }: { leadingItem: PreferenceItem }) => {
    return <View style={styles.divider} />;
  };

  return (
    <View style={styles.sectionContainer}>
      <UvTypography variant="h7" color={Colors.white} style={styles.sectionTitle}>
        PREFERENCES
      </UvTypography>
      <FlatList
        data={preferenceItems}
        renderItem={renderPreferenceItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={renderSeparator}
        scrollEnabled={false}
        style={styles.prefList}
      />
    </View>
  );
};

export default UvPreferences;

const styles = StyleSheet.create({
  sectionContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    letterSpacing: 2,
  },
  prefList: {
    width: '100%',
  },
  prefItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  prefLabel: {
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.base[800],
  },
});


