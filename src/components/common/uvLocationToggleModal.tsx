import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import UvTypography from './uvTypography';
import Colors from '../../theme/color';
import LocationIcon from '../../assets/svg/location.svg';

type UvLocationToggleModalProps = {
  visible: boolean;
  isLocationEnabled: boolean;
  onClose: () => void;
};

const UvLocationToggleModal: React.FC<UvLocationToggleModalProps> = ({
  visible,
  isLocationEnabled,
  onClose,
}) => {
  const handleBackdropPress = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.iconContainer}>
                <LocationIcon
                  width={48}
                  height={48}
                  color={isLocationEnabled ? Colors.success[500] : Colors.danger[500]}
                />
              </View>

              <UvTypography
                variant="h6"
                color={Colors.white}
                align="center"
                style={styles.title}
              >
                Location {isLocationEnabled ? 'Enabled' : 'Disabled'}
              </UvTypography>

              <UvTypography
                variant="body"
                color={Colors.base[300]}
                align="center"
                style={styles.message}
              >
                {isLocationEnabled
                  ? 'Location services have been turned on. You can now use location-based features.'
                  : 'Location services have been turned off. Some location-based features may not be available.'}
              </UvTypography>

              <TouchableOpacity
                style={styles.button}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <UvTypography
                  variant="body"
                  color={Colors.white}
                >
                  OKAY
                </UvTypography>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: Colors.base[900],
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 50,
    backgroundColor: Colors.base[800],
  },
  title: {
    marginBottom: 12,
    fontWeight: '600',
  },
  message: {
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: Colors.primary[500],
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
});

export default UvLocationToggleModal;

