import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UvTypography from './uvTypography';
import Colors from '../../theme/color';
import BackArrowIcon from '../../assets/svg/backArrow.svg';

interface UvHeaderProps {
  title: string;
  onBackPress?: () => void;
  backArrowColor?: string;
  titleColor?: string;
  titleVariant?: 'h4' | 'h5' | 'h6' | 'h7';
  showBackButton?: boolean;
  containerStyle?: any;
  backButtonStyle?: any;
}

const UvHeader: React.FC<UvHeaderProps> = ({
  title,
  onBackPress,
  backArrowColor = Colors.white,
  titleColor = Colors.white,
  titleVariant = 'h6',
  showBackButton = true,
  containerStyle,
  backButtonStyle,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.headerRow}>
        {showBackButton && (
          <TouchableOpacity
            style={[styles.backButton, backButtonStyle]}
            onPress={handleBackPress}
            activeOpacity={0.8}
          >
            <BackArrowIcon width={20} height={20} color={backArrowColor} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <UvTypography variant={titleVariant} align="center" color={titleColor}>
            {title}
          </UvTypography>
        </View>
      </View>
    </View>
  );
};

export default UvHeader;

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

