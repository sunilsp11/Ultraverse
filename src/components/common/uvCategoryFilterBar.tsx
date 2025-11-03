import React from 'react'
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'
import UvTypography from './uvTypography'
import UvSectionHeader from './uvSectionHeader'
import Colors from '../../theme/color'

const CATEGORIES = [
  'Shooter',
  'Action',
  'Adventure',
  'Racing',
  'Sports',
  'Strategy',
  'RPG',
]

type Props = {
  onCategoryPress?: (category: string) => void
  onViewAllPress?: () => void
}

const UvCategoryFilterBar: React.FC<Props> = ({ 
  onCategoryPress,
  onViewAllPress 
}) => {

  const handleCategoryPress = (category: string) => {
    onCategoryPress?.(category)
  }

  return (
    <View style={styles.container}>
      <UvSectionHeader 
        title="CATEGORIES"
        onViewAllPress={onViewAllPress}
      />

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <UvTypography 
              variant="body" 
              color={Colors.white}
            >
              {category}
            </UvTypography>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

export default UvCategoryFilterBar

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
  },
  scrollContent: {
    gap: 12,
    paddingHorizontal: 18,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: '#00B4FF33',
  },
})