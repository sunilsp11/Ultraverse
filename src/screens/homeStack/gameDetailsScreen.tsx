import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ImageSourcePropType,
  ActivityIndicator,
  Alert,
} from 'react-native'
import Video from 'react-native-video'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BackArrowIcon from '../../assets/svg/backArrow.svg'
import PlayIcon from '../../assets/svg/playIcon.svg'
import UvButton from '../../components/common/uvButton'
import UvTypography from '../../components/common/uvTypography'
import Colors from '../../theme/color'
import { RootStackParamList } from '../../types/navigationTypes'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector } from '../../store/store'
import { useGetGameByIdQuery } from '../../services/games/gamesApi'
import { useLazyGetUserGameFeedbackQuery } from '../../services/feedback/gameFeedbackApi'

const { width: screenWidth } = Dimensions.get('window')
const GAMEPLAY_CARD_WIDTH = screenWidth * 0.65
const GAMEPLAY_CARD_HEIGHT = GAMEPLAY_CARD_WIDTH * 0.6

const FALLBACK_GAME_IMAGE = require('../../assets/images/Fortnite.png')

type GameDetailsScreenRouteProp = RouteProp<RootStackParamList, 'GameDetailsScreen'>
type GameDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameDetailsScreen'>

const GameDetailsScreen = () => {
  const navigation = useNavigation<GameDetailsScreenNavigationProp>()
  const route = useRoute<GameDetailsScreenRouteProp>()

  const insets = useSafeAreaInsets();
  const { gameTitle, gameImage, genre, description, gameInfo, gameId } = route.params

  const scrollY = useRef(new Animated.Value(0)).current

  const storedGame = useAppSelector(state =>
    state.games.games.find(game => String(game.id) === String(gameId)),
  )

  const { data: fetchedGame, isFetching } = useGetGameByIdQuery(gameId, {
    skip: !gameId,
  })

  const [checkExistingGameFeedback, { isFetching: isCheckingExistingFeedback }] =
    useLazyGetUserGameFeedbackQuery()

  const handleFeedbackPress = useCallback(async () => {
    if (isCheckingExistingFeedback) {
      return;
    }

    const parsedGameId = Number(gameId);

    try {
      if (Number.isFinite(parsedGameId)) {
        const existingFeedback = await checkExistingGameFeedback(parsedGameId).unwrap();

        if (Array.isArray(existingFeedback) && existingFeedback.length > 0) {
          Alert.alert(
            'Feedback Already Submitted',
            'You have already submitted feedback for this game.',
          );
          return;
        }
      }
    } catch (error) {
      console.error('Unable to verify existing game feedback', error);
    }

    if (Number.isFinite(parsedGameId)) {
      navigation.navigate('GameFeedbackScreen', { gameId: String(parsedGameId) });
      return;
    }

    navigation.navigate('GameFeedbackScreen', { gameId: gameId || '1' });
  }, [checkExistingGameFeedback, gameId, isCheckingExistingFeedback, navigation])

  const resolvedGame = fetchedGame ?? storedGame
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)
  const [loadingVideoId, setLoadingVideoId] = useState<string | null>(null)

  const fallbackHeroImage = (gameImage as ImageSourcePropType | undefined) ?? FALLBACK_GAME_IMAGE

  const heroImageSource: ImageSourcePropType = useMemo(() => {
    const primaryMediaImage = resolvedGame?.media?.find(
      media => media?.type === 'image' && media?.url && media?.is_primary,
    )
    const fallbackMediaImage = resolvedGame?.media?.find(
      media => media?.type === 'image' && media?.url,
    )

    if (primaryMediaImage?.url) {
      return { uri: primaryMediaImage.url }
    }

    if (fallbackMediaImage?.url) {
      return { uri: fallbackMediaImage.url }
    }

    if (resolvedGame?.primary_image) {
      return { uri: resolvedGame.primary_image }
    }

    return fallbackHeroImage
  }, [resolvedGame, fallbackHeroImage])

  type GameplayMediaItem = {
    id: string
    type: 'image' | 'video'
    source: ImageSourcePropType
    videoUrl?: string
    title?: string | null
  }

  const gameplayMedia = useMemo<GameplayMediaItem[]>(
    () => {
      if (resolvedGame?.media?.length) {
        return resolvedGame.media.reduce<GameplayMediaItem[]>((acc, media, index) => {
          if (media?.type === 'video' && media?.url) {
            acc.push({
              id: String(media?.id ?? `video-${index}`),
              type: 'video',
              source: heroImageSource,
              videoUrl: media.url,
              title: media.title,
            })
          } else if (media?.type === 'image' && media?.url) {
            acc.push({
              id: String(media?.id ?? `image-${index}`),
              type: 'image',
              source: { uri: media.url } as ImageSourcePropType,
              title: media.title,
            })
          }
          return acc
        }, [])
      }

      return [
        {
          id: 'fallback-image',
          type: 'image',
          source: heroImageSource,
        },
      ]
    },
    [resolvedGame?.media, heroImageSource],
  )

  const displayTitle = useMemo(
    () => resolvedGame?.name ?? gameTitle ?? 'UNTITLED GAME',
    [resolvedGame?.name, gameTitle],
  )

  const displayGenres = useMemo(() => {
    const categories = resolvedGame?.categories
      ?.map(category => category?.name)
      .filter((name): name is string => Boolean(name))
    if (categories?.length) {
      return categories.join(', ')
    }
    return genre ?? 'Unknown Genre'
  }, [resolvedGame?.categories, genre])

  const displayDescription = useMemo(
    () =>
      resolvedGame?.short_description ??
      resolvedGame?.description ??
      description ??
      '',
    [resolvedGame?.short_description, resolvedGame?.description, description],
  )

  const displayInfo = useMemo(
    () =>
      resolvedGame?.info ??
      resolvedGame?.description ??
      resolvedGame?.short_description ??
      gameInfo ??
      '',
    [resolvedGame?.info, resolvedGame?.description, resolvedGame?.short_description, gameInfo],
  )

  const formattedReleaseDate = useMemo(() => {
    if (resolvedGame?.release_date) {
      return resolvedGame.release_date
    }
    return 'TBA'
  }, [resolvedGame?.release_date])

  const displayPublisher = useMemo(
    () => resolvedGame?.publisher?.name ?? 'Unknown Publisher',
    [resolvedGame?.publisher?.name],
  )

  const handleMediaPress = (mediaItem: GameplayMediaItem) => {
    if (mediaItem.type !== 'video' || !mediaItem.videoUrl) {
      return
    }

    const beginPlayback = () => {
      if (playingVideoId === mediaItem.id) {
        setPlayingVideoId(null)
        setLoadingVideoId(null)
      } else {
        setPlayingVideoId(mediaItem.id)
        setLoadingVideoId(mediaItem.id)
      }
    }

    if (authToken) {
      beginPlayback()
      return
    }

    AsyncStorage.getItem('UserToken')
      .then(token => {
        if (token) {
          setAuthToken(token)
        }
        beginPlayback()
      })
      .catch(error => {
        console.warn('Failed to fetch auth token for video:', error)
        beginPlayback()
      })
  }

  useEffect(() => {
    let isMounted = true
    AsyncStorage.getItem('UserToken')
      .then(token => {
        if (isMounted && token) {
          setAuthToken(token)
        }
      })
      .catch(error => {
        console.warn('Failed to load auth token for video playback:', error)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)'],
    extrapolate: 'clamp',
  })

  return (
    <View style={[styles.container,{backgroundColor: Colors.base[950]}]}>
      {(isFetching && !resolvedGame) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      )}
      <Animated.View 
        style={[
          styles.headerBar,
          { backgroundColor: headerBackgroundColor, height: insets.top + 55}
        ]}
      />
      
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top  }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <BackArrowIcon width={20} height={20} color={Colors.white} />
      </TouchableOpacity>
      
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Image Section */}
        <View style={styles.heroSection}>
          <Image
            source={heroImageSource}
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
            {displayTitle.toUpperCase()}
          </UvTypography>

          {displayGenres && (
            <UvTypography
              variant="body"
              color={Colors.base[300]}
              style={styles.genre}
            >
              {displayGenres}
            </UvTypography>
          )}

          {displayDescription && (
            <UvTypography
              variant="body"
              color={Colors.white}
              style={styles.description}
            >
              {displayDescription}
            </UvTypography>
          )}
        </View>

        {/* Gameplay Section */}
        {gameplayMedia.length > 0 && (
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
              {gameplayMedia.map((mediaItem, index) => (
                <TouchableOpacity
                  key={mediaItem.id}
                  style={[
                    styles.gameplayCard,
                    index === 0 && styles.firstGameplayCard,
                  ]}
                  activeOpacity={mediaItem.type === 'video' ? 0.8 : 1}
                  onPress={() => handleMediaPress(mediaItem)}
                  disabled={mediaItem.type !== 'video'}
                >
                  {mediaItem.type === 'video' && playingVideoId === mediaItem.id ? (
                    <View style={styles.inlineVideoContainer}>
                      <Video
                        key={mediaItem.id}
                        source={{
                          uri: mediaItem.videoUrl ?? '',
                          headers: authToken
                            ? { Authorization: `Bearer ${authToken}` }
                            : undefined,
                        }}
                        style={styles.inlineVideo}
                        resizeMode="cover"
                        paused={false}
                        controls
                        onLoadStart={() => setLoadingVideoId(mediaItem.id)}
                        onLoad={() => setLoadingVideoId(null)}
                        onBuffer={({ isBuffering }) => {
                          if (isBuffering) {
                            setLoadingVideoId(mediaItem.id)
                          } else if (loadingVideoId === mediaItem.id) {
                            setLoadingVideoId(null)
                          }
                        }}
                        onError={(error) => {
                          console.warn('Video playback error:', error)
                          Alert.alert('Playback unavailable', 'We could not play this clip right now. Please try again later.')
                          setPlayingVideoId(null)
                          setLoadingVideoId(null)
                        }}
                        onEnd={() => {
                          setPlayingVideoId(null)
                          setLoadingVideoId(null)
                        }}
                      />
                      {loadingVideoId === mediaItem.id && (
                        <View style={styles.inlineLoadingOverlay}>
                          <ActivityIndicator size="large" color={Colors.white} />
                        </View>
                      )}
                    </View>
                  ) : (
                    <>
                      <Image
                        source={mediaItem.source}
                        style={styles.gameplayThumbnail}
                        resizeMode="cover"
                      />
                      {mediaItem.type === 'video' && (
                        <View style={styles.playOverlay}>
                          <View style={styles.playButton}>
                            <PlayIcon width={24} height={24} color={Colors.base[950]} />
                          </View>
                        </View>
                      )}
                    </>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
  
      <View style={styles.gameInfoSection}>
        <UvTypography
          variant="h4"
          color={Colors.white}
          letterSpacing={2}
          style={styles.gameInfoTitle}
        >
          GAME INFO
        </UvTypography>

        {displayInfo ? (
          <UvTypography
            variant="body"
            color={Colors.white}
            style={styles.gameInfoDescription}
          >
            {displayInfo}
          </UvTypography>
        ) : (
          <UvTypography
            variant="body"
            color={Colors.base[400]}
            style={styles.gameInfoDescription}
          >
            Details coming soon.
          </UvTypography>
        )}

        <View style={styles.metaRowGroup}>
          <View style={styles.metaRow}>
            <UvTypography variant="bodyXs" color={Colors.base[400]}>
              Release:
            </UvTypography>
            <UvTypography variant="body" color={Colors.white} style={styles.metaValue}>
              {formattedReleaseDate}
            </UvTypography>
          </View>

          <View style={styles.metaRow}>
            <UvTypography variant="bodyXs" color={Colors.base[400]}>
              Genres:
            </UvTypography>
            <UvTypography variant="body" color={Colors.white} style={styles.metaValue}>
              {displayGenres}
            </UvTypography>
          </View>

          <View style={styles.metaRow}>
            <UvTypography variant="bodyXs" color={Colors.base[400]}>
              Publisher:
            </UvTypography>
            <UvTypography variant="body" color={Colors.white} style={styles.metaValue}>
              {displayPublisher}
            </UvTypography>
          </View>
        </View>
      </View>

      </Animated.ScrollView>
      <View style={styles.bottomButtonContainer}>
        <UvButton
          title="Play Now"
          onPress={() => console.log('Play Now pressed')}
          icon={<PlayIcon width={16} height={16} color={Colors.base[950]} />}
        />
        <UvButton
          title="Feedback"
          onPress={handleFeedbackPress}
          variant="secondary"
          style={styles.feedbackButton}
          disabled={isCheckingExistingFeedback}
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
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
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
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  inlineVideoContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.base[900],
  },
  inlineVideo: {
    width: '100%',
    height: '100%',
  },
  inlineLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
})