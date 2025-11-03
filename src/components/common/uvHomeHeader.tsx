import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import SearchIcon from '../../assets/svg/search.svg'
import UvAppIcon from '../../assets/svg/uvAppIcon.svg'
import UvTypography from './uvTypography'
import Colors from '../../theme/color'

interface UvHomeHeaderProps {
  userName?: string
  onSearchPress?: () => void
}

const UvHomeHeader: React.FC<UvHomeHeaderProps> = ({
  userName = 'MIKE',
  onSearchPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        <UvAppIcon width={32} height={24} />
        <View style={styles.textContainer}>
          <UvTypography
            variant="h6"
            color={Colors.white}
            letterSpacing={2}
          >
            HI, {userName}!
          </UvTypography>
          <UvTypography
            variant="h5"
            color={Colors.white}
            letterSpacing={2}
            style={styles.readyText}
          >
            READY TO PLAY?
          </UvTypography>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.searchButton}
        onPress={onSearchPress}
      >
        <SearchIcon width={18} height={18} color={Colors.black} />
      </TouchableOpacity>
    </View>
  )
}

export default UvHomeHeader

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  leftSection: {
    flexDirection: 'column',
    gap: 12,
  },
  textContainer: {
    gap: 4,
  },
  readyText: {
    marginTop: 2,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
})

