import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import SearchIcon from '../../assets/svg/search.svg'
import ProfileIcon from '../../assets/svg/profile.svg'
import UvAppIcon from '../../assets/svg/uvAppIcon.svg'
import UvTypography from './uvTypography'
import Colors from '../../theme/color'

interface UvHomeHeaderProps {
  userName?: string
  onSearchPress?: () => void
  onProfilePress?: () => void
}

const UvHomeHeader: React.FC<UvHomeHeaderProps> = ({
  userName = 'MIKE',
  onSearchPress,
  onProfilePress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.mainContent}>
        <View style={styles.leftContent}>
          <View style={styles.logoContainer}>
            <UvAppIcon width={32} height={24} />
            <TouchableOpacity
              style={styles.profileButton}
              onPress={onProfilePress}
            >
              <ProfileIcon width={20} height={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.textSection}>
            <UvTypography
              variant="h6"
              color={Colors.white}
              letterSpacing={2}
            >
              HI, {userName}!
            </UvTypography>
            <View style={styles.readyRow}>
              <UvTypography
                variant="h6"
                color={Colors.white}
                letterSpacing={2}
                style={styles.readyText}
              >
                READY TO PLAY?
              </UvTypography>
              <View>
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={onSearchPress}
                >
                  <SearchIcon width={18} height={18} color={Colors.black} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>


      </View>
    </View>
  )
}

export default UvHomeHeader

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContent: {
    flexDirection: 'column',
    gap: 12,
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  profileButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSection: {
    gap: 4,
  },
  readyRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
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

