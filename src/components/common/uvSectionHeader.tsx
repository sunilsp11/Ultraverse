import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import UvTypography from './uvTypography'
import Colors from '../../theme/color'
import { TypographyVariant } from '../../theme/typography'

type Props = {
  title: string
  onViewAllPress?: () => void
  showViewAll?: boolean
  titleVariant?: TypographyVariant
  titleColor?: string
  viewAllText?: string
  containerStyle?: object
}

const UvSectionHeader: React.FC<Props> = ({ 
  title,
  onViewAllPress,
  showViewAll = true,
  titleVariant = 'h7',
  titleColor = Colors.white,
  viewAllText = 'View All',
  containerStyle
}) => {
  return (
    <View style={[styles.headerRow, containerStyle]}>
      <UvTypography 
        variant={titleVariant} 
        color={titleColor}
        letterSpacing={2}
      >
        {title}
      </UvTypography>
      {showViewAll && (
        <TouchableOpacity onPress={onViewAllPress}>
          <UvTypography 
            variant="body" 
            color={Colors.white}
          >
            {viewAllText}
          </UvTypography>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default UvSectionHeader

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
})

