import React from 'react'
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import UvTypography from './uvTypography'
import Colors from '../../theme/color'

interface UvActionButtonProps {
  title: string
  onPress: () => void
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  style?: ViewStyle
  fullWidth?: boolean
}

const UvActionButton: React.FC<UvActionButtonProps> = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  style,
  fullWidth = false,
}) => {
  const getOuterBorderColor = () => {
    if (disabled) return Colors.base[600]
    if (variant === 'secondary') return Colors.primary[500]
    return Colors.white
  }

  const getBackgroundColor = () => {
    if (disabled) return Colors.base[700]
    return Colors.white
  }

  const getTextColor = () => {
    if (disabled) return Colors.base[400]
    return Colors.base[950]
  }

  return (
    <View
      style={[
        styles.outerContainer,
        {
          borderColor: getOuterBorderColor(),
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.innerButton,
          {
            backgroundColor: getBackgroundColor(),
          },
        ]}
        activeOpacity={0.9}
        disabled={disabled}
      >
        <UvTypography 
          variant="h6" 
          color={getTextColor()}
          letterSpacing={1}
        >
          {title}
        </UvTypography>
        
        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default UvActionButton

const styles = StyleSheet.create({
  outerContainer: {
    height: 48,
    borderWidth: 1,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    backgroundColor: 'transparent',
  },
  innerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    height: 40,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 14,
    gap: 8,
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  iconContainer: {
    marginLeft: 4,
  },
})

