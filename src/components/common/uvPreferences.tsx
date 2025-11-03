import React from "react";
import { StyleSheet, View, Switch } from "react-native";
import UvTypography from "./uvTypography";
import Colors from "../../theme/color";
import AlertIcon from "../../assets/svg/alert.svg";
import TranslateIcon from "../../assets/svg/translateIcon.svg";
import LocationIcon from "../../assets/svg/location.svg";
import SignoutIcon from "../../assets/svg/signoutIcon.svg";
type UvPreferencesProps = {
  locationEnabled: boolean;
  onToggle: (value: boolean) => void;
};

const UvPreferences = ({ locationEnabled, onToggle }: UvPreferencesProps) => {
  return (
    <View style={styles.sectionContainer}>
      <UvTypography variant="h7" color={Colors.white} style={styles.sectionTitle}>
        PREFERENCES
      </UvTypography>
      <View style={styles.prefList}>
      <View style={styles.prefItem}>
        <AlertIcon width={24} height={24} color={Colors.white}/>
        <UvTypography variant="body" color={Colors.white} style={styles.prefLabel}>Notification Settings</UvTypography>
      </View>
      <View style={styles.divider} />
      <View style={styles.prefItem}>
        <TranslateIcon width={24} height={24} color={Colors.white}/>
        <UvTypography variant="body" color={Colors.white} style={styles.prefLabel}>Language</UvTypography>
      </View>
      <View style={styles.divider} />
      <View style={styles.prefItem}>
        <LocationIcon width={24} height={24} color={Colors.white}/>
        <UvTypography variant="body" color={Colors.white} style={styles.prefLabel}>Location Permissions</UvTypography>
        <View style={{ flex: 1 }} />
        <Switch
          value={locationEnabled}
          onValueChange={onToggle}
          thumbColor={locationEnabled ? Colors.black : Colors.base[300]}
          trackColor={{ true: Colors.primary[500], false: Colors.base[700] }}
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.prefItem}>
        <SignoutIcon width={24} height={24} color={Colors.white}/>
        <UvTypography variant="body" color={Colors.white} style={styles.prefLabel}>Log Out</UvTypography>
      </View>
      </View>
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


