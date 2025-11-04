import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import UvTypography from './uvTypography';
import Colors from '../../theme/color';
import CrossIcon from '../../assets/svg/cross.svg';


interface UvFeedbackHeaderProps {
  currentStep: number;
  totalSteps: number;
  onClose: () => void;
  title?: string;
}

const UvFeedbackHeader: React.FC<UvFeedbackHeaderProps> = ({
  currentStep,
  totalSteps,
  onClose,
  title = 'GAME FEEDBACK',
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <View style={styles.closeButtonInner}>
            <CrossIcon width={16} height={16} />
          </View>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <UvTypography variant="h7" color={Colors.base[50]}>
            {title}
          </UvTypography>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%` },
            ]}
          />
        </View>
        <UvTypography
          variant="bodyXs"
          color={Colors.white}
          style={styles.stepCounter}
        >
          {currentStep}/{totalSteps}
        </UvTypography>
      </View>
    </View>
  );
};

export default UvFeedbackHeader;

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 0,
  },
  closeButtonInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    backgroundColor: Colors.base[800],
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  stepCounter: {
    minWidth: 30,
  },
});
