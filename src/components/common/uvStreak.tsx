import React from "react";
import { StyleSheet, View } from "react-native";
import UvTypography from "./uvTypography";
import Colors from "../../theme/color";
import FlashIcon from "../../assets/svg/flash.svg";
const DAYS = ['S','M','T','W','T','F','S'];

const UvStreak = () => {
  return (
    <View style={styles.sectionContainer}>
      <UvTypography variant="h7" color={Colors.white} style={styles.sectionTitle}>
        STREAK
      </UvTypography>
      <View style={styles.streakRow}>
        {DAYS.map((day, index) => (
          <View key={day+index} style={styles.streakItem}>
            <View style={styles.dayCircle}>
              <UvTypography variant="p" align="center" color={Colors.white}>
                {day}
              </UvTypography>
            </View>
            <FlashIcon width={16} height={20} color={Colors.primary[400]} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default UvStreak;

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
  streakRow: {
    backgroundColor: Colors.base[800],
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dayCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: Colors.base[900],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
});


