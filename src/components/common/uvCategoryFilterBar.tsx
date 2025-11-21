import React from 'react'
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'
import UvTypography from './uvTypography'
import UvSectionHeader from './uvSectionHeader'
import Colors from '../../theme/color'

type Props = {
  onCategoryPress?: (category: string) => void
  onViewAllPress?: () => void
  categories?: string[]
  selectedCategory?: string
}

const UvCategoryFilterBar: React.FC<Props> = ({ 
  onCategoryPress,
  onViewAllPress,
  categories = [],
  selectedCategory
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
        {categories.map((category) => {
          const isSelected = selectedCategory === category
          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                isSelected && styles.categoryButtonSelected
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
          )
        })}
      </ScrollView>
    </View>
  )
}

export default UvCategoryFilterBar

const styles = StyleSheet.create({
  container: {
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
  categoryButtonSelected: {
    backgroundColor: Colors.primary[400],
  },
})