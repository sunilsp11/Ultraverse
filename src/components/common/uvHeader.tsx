import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import BackArrowIcon from '../../assets/svg/backArrow.svg';
import Colors from '../../theme/color';
import UvTypography from './uvTypography';

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
      {showBackButton ? (
        <Pressable onPress={handleBackPress} style={[styles.backButton, backButtonStyle]}>
          <BackArrowIcon width={20} height={20} color={backArrowColor} />
        </Pressable>
      ) : (
        <View style={{width: 44}}/>
      )}
      <UvTypography variant={titleVariant} align="center" color={titleColor} style={{marginTop:8}}>
        {title}
      </UvTypography>
      <View style={{width: 44}}/>
    </View>
  );
};

export default UvHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
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
    padding: 10,
    width: 44,
  },
});

