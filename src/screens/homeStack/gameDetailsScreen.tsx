import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import BackArrowIcon from '../../assets/svg/backArrow.svg'
import PlayIcon from '../../assets/svg/playIcon.svg'
import UvButton from '../../components/common/uvButton'
import UvTypography from '../../components/common/uvTypography'
import Colors from '../../theme/color'
import { RootStackParamList } from '../../types/navigationTypes'

const { width: screenWidth } = Dimensions.get('window')
const GAMEPLAY_CARD_WIDTH = screenWidth * 0.65
const GAMEPLAY_CARD_HEIGHT = GAMEPLAY_CARD_WIDTH * 0.6

type GameDetailsScreenRouteProp = RouteProp<RootStackParamList, 'GameDetailsScreen'>
type GameDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameDetailsScreen'>

const GameDetailsScreen = () => {
  const navigation = useNavigation<GameDetailsScreenNavigationProp>()
  const route = useRoute<GameDetailsScreenRouteProp>()

  const { gameTitle, gameImage, genre, description, gameInfo, gameId } = route.params

  const gameplayVideos = [
    { id: '1', thumbnail: gameImage },
    { id: '2', thumbnail: gameImage },
    { id: '3', thumbnail: gameImage },
  ]

  return (
    <View style={[styles.container,{backgroundColor: Colors.base[950]}]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <BackArrowIcon width={20} height={20} color={Colors.white} />
      </TouchableOpacity>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Image Section */}
        <View style={styles.heroSection}>
          <Image
            source={gameImage}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Game Info Section */}
        <View style={styles.infoSection}>
          <UvTypography
            variant="h2"
            color={Colors.white}
            letterSpacing={3}
            style={styles.gameTitle}
          >
            {gameTitle.toUpperCase()}
          </UvTypography>

          {genre && (
            <UvTypography
              variant="body"
              color={Colors.base[300]}
              style={styles.genre}
            >
              {genre}
            </UvTypography>
          )}

          {description && (
            <UvTypography
              variant="body"
              color={Colors.white}
              style={styles.description}
            >
              {description}
            </UvTypography>
          )}
        </View>

        {/* Gameplay Section */}
        <View style={styles.gameplaySection}>
          <UvTypography
            variant="h4"
            color={Colors.white}
            letterSpacing={2}
            style={styles.gameplayTitle}
          >
            GAMEPLAY
          </UvTypography>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.gameplayScrollContent}
            decelerationRate="fast"
            snapToInterval={GAMEPLAY_CARD_WIDTH + 16}
            snapToAlignment="start"
          >
            {gameplayVideos.map((video, index) => (
              <TouchableOpacity
                key={video.id}
                style={[
                  styles.gameplayCard,
                  index === 0 && styles.firstGameplayCard,
                ]}
                activeOpacity={0.8}
              >
                <Image
                  source={video.thumbnail}
                  style={styles.gameplayThumbnail}
                  resizeMode="cover"
                />

                {/* Play Icon Overlay */}
                <View style={styles.playIconContainer}>
                  <PlayIcon width={20} height={20} color={Colors.white} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
  

      <View style={styles.gameInfoSection}>
        <UvTypography
          variant="h4"
          color={Colors.white}
          letterSpacing={2}
          style={styles.gameInfoTitle}
        >
          GAME INFO
        </UvTypography>

        <UvTypography
          variant="body"
          color={Colors.white}
          style={styles.gameInfoDescription}
        >
          {gameInfo}
        </UvTypography>

        <View style={styles.metaRowGroup}>
          <View style={styles.metaRow}>
            <UvTypography variant="bodyXs" color={Colors.base[400]}>
              Release:
            </UvTypography>
            <UvTypography variant="body" color={Colors.white} style={styles.metaValue}>
              21/7/2017
            </UvTypography>
          </View>

          <View style={styles.metaRow}>
            <UvTypography variant="bodyXs" color={Colors.base[400]}>
              Genres:
            </UvTypography>
            <UvTypography variant="body" color={Colors.white} style={styles.metaValue}>
              Action, Adventure
            </UvTypography>
          </View>

          <View style={styles.metaRow}>
            <UvTypography variant="bodyXs" color={Colors.base[400]}>
              Publisher:
            </UvTypography>
            <UvTypography variant="body" color={Colors.white} style={styles.metaValue}>
              Epic Games Inc.
            </UvTypography>
          </View>
        </View>
      </View>

      </ScrollView>
      <View style={styles.bottomButtonContainer}>
        <UvButton
          title="Play Now"
          onPress={() => console.log('Play Now pressed')}
          icon={<PlayIcon width={16} height={16} color={Colors.base[950]} />}
        />
        <UvButton
          title="Feedback"
          onPress={() => navigation.navigate('GameFeedbackScreen', { gameId: gameId || '1' })}
          variant="secondary"
          style={styles.feedbackButton}
        />
      </View>
    </View>
  )
}

export default GameDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    width: screenWidth,
    height: screenWidth * 1.2,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    backgroundColor: 'white',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  gameTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  genre: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  gameplaySection: {
    paddingBottom: 32,
  },
  gameplayTitle: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  gameplayScrollContent: {
    paddingRight: 20,
  },
  gameplayCard: {
    width: GAMEPLAY_CARD_WIDTH,
    height: GAMEPLAY_CARD_HEIGHT,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.base[800],
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  firstGameplayCard: {
    marginLeft: 20,
  },
  gameplayThumbnail: {
    width: '100%',
    height: '100%',
  },
  playIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  gameInfoSection: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  gameInfoTitle: {
    marginBottom: 14,
  },
  gameInfoDescription: {
    lineHeight: 22,
    color: Colors.base[100],
  },
  metaRowGroup: {
    marginTop: 20,
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  metaValue: {
    marginLeft: 8,
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'flex-end',
    gap: 12,
    position: 'absolute',
    bottom: 20,
    right: 0,
    zIndex: 10,
  },
  feedbackButton: {
    marginTop: 0,
  },
})

