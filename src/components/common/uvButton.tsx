import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from '../../theme/color';
import UvTypography from './uvTypography';

interface Props {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: object;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const UvButton: React.FC<Props> = ({ 
  onPress, 
  title, 
  variant = 'primary', 
  disabled = false,
  style,
  icon,
  iconPosition = 'right',
}) => {
  return (
    <View style={[styles.ctaOuter, style]}>
      <TouchableOpacity 
        style={[
          styles.ctaInner, 
          variant === 'secondary' && styles.ctaInnerSecondary,
          disabled && styles.ctaInnerDisabled
        ]} 
        onPress={onPress} 
        activeOpacity={0.9}
        disabled={disabled}
      >
        {icon && iconPosition === 'left' && (
          <View style={styles.iconContainerLeft}>{icon}</View>
        )}
        <UvTypography 
          variant="body" 
          color={variant === 'primary' ? Colors.black : Colors.white} 
          align="center"
        >
          {title}
        </UvTypography>
        {icon && iconPosition === 'right' && (
          <View style={styles.iconContainerRight}>{icon}</View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UvButton;

const styles = StyleSheet.create({
  ctaOuter: {
    alignSelf: 'center',
    marginTop: 32,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.white,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaInner: {
    height: 32,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#DDE6EA',
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  ctaInnerSecondary: {
    backgroundColor: 'transparent',
    borderColor: Colors.white,
  },
  ctaInnerDisabled: {
    backgroundColor: Colors.base[500],
    borderColor: Colors.base[500],
  },
  iconContainerRight: {
    marginLeft: 8,
  },
  iconContainerLeft: {
    marginRight: 8,
  },
});
