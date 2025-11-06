import React from "react";
import { StyleSheet, View } from "react-native";
import UvTypography from "./uvTypography";
import Colors from "../../theme/color";
import XboxControllerIcon from "../../assets/svg/xboxController.svg";
import TrophyIcon from "../../assets/svg/trophy.svg";
import ClockIcon from "../../assets/svg/clock.svg";
const UvQuickStats = () => {
  return (
    <View style={styles.sectionContainer}>
      <UvTypography variant="h7" color={Colors.white} style={styles.sectionTitle}>
        QUICK STATS
      </UvTypography>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <XboxControllerIcon width={24} height={24} color={Colors.white}/>
          <View style={styles.statBoxContent}>
          <UvTypography variant="p" align="center" color={Colors.primary[500]}>
            34
          </UvTypography>
          </View>
          <UvTypography variant="bodyXs" align="center" color={Colors.white}>
            Games Played
          </UvTypography>
        </View>
        <View style={styles.statBox}>
          <TrophyIcon width={24} height={24} color={Colors.white}/>
          <View style={styles.statBoxContent}>
            <UvTypography variant="p" align="center" color={Colors.primary[500]}>
              12
            </UvTypography>
          </View>
          <UvTypography variant="bodyXs" align="center" color={Colors.base[300]}>
            Wins
          </UvTypography>
        </View>
        <View style={styles.statBox}>
          <ClockIcon width={24} height={24} color={Colors.white}/>
          <View style={styles.statBoxContent}>
          <UvTypography variant="p" align="center" color={Colors.primary[500]}>
            16h 45m
          </UvTypography>
          </View>
          <UvTypography variant="bodyXs" align="center" color={Colors.base[300]}>
            Play Time
          </UvTypography>
        </View>
      </View>
    </View>
  );
};

export default UvQuickStats;

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
  statsRow: {
    backgroundColor: Colors.base[800],
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  statBox: {
    width: '32%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBoxContent: {
    marginTop: 4,
  },
});


