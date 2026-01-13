// import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
// import { NativeStackNavigationProp } from '@react-navigation/native-stack'
// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// import {
//   Animated,
//   Dimensions,
//   Image,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   View,
//   ImageSourcePropType,
//   ActivityIndicator,
//   Alert,
//   Modal,
// } from 'react-native'
// import Video from 'react-native-video'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import BackArrowIcon from '../../assets/svg/backArrow.svg'
// import PlayIcon from '../../assets/svg/playIcon.svg'
// import UvButton from '../../components/common/uvButton'
// import UvTypography from '../../components/common/uvTypography'
// import UvImageGalleryModal, { GalleryImageItem } from '../../components/common/uvImageGalleryModal'
// import Colors from '../../theme/color'
// import { RootStackParamList } from '../../types/navigationTypes'
// import { useSafeAreaInsets } from 'react-native-safe-area-context'
// import { useGetGameByIdQuery } from '../../services/games/gamesApi'
// import { useLazyGetUserGameFeedbackQuery } from '../../services/feedback/gameFeedbackApi'


// const { width: screenWidth } = Dimensions.get('window')
// const GAMEPLAY_CARD_WIDTH = screenWidth * 0.65
// const GAMEPLAY_CARD_HEIGHT = GAMEPLAY_CARD_WIDTH * 0.6

// type GameDetailsScreenRouteProp = RouteProp<RootStackParamList, 'GameDetailsScreen'>
// type GameDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameDetailsScreen'>

// const GameDetailsScreen = () => {
//   const navigation = useNavigation<GameDetailsScreenNavigationProp>()
//   const route = useRoute<GameDetailsScreenRouteProp>()

//   const insets = useSafeAreaInsets();
//   const { gameTitle, gameImage, genre, description, gameInfo, gameId } = route.params

//   const scrollY = useRef(new Animated.Value(0)).current


//   const { data: fetchedGame, isFetching } = useGetGameByIdQuery(gameId, {
//     skip: !gameId,
//   })

//   const [checkExistingGameFeedback, { isFetching: isCheckingExistingFeedback }] =
//     useLazyGetUserGameFeedbackQuery()

//   const handleFeedbackPress = useCallback(async () => {
//     if (isCheckingExistingFeedback) {
//       return;
//     }

//     const parsedGameId = Number(gameId);

//     try {
//       if (Number.isFinite(parsedGameId)) {
//         const existingFeedback = await checkExistingGameFeedback(parsedGameId).unwrap();

//         if (Array.isArray(existingFeedback) && existingFeedback.length > 0) {
//           Alert.alert(
//             'Feedback Already Submitted',
//             'You have already submitted feedback for this game.',
//           );
//           return;
//         }
//       }
//     } catch (error) {
//       console.error('Unable to verify existing game feedback', error);
//     }

//     if (Number.isFinite(parsedGameId)) {
//       navigation.navigate('GameFeedbackScreen', { gameId: String(parsedGameId) });
//       return;
//     }

//     navigation.navigate('GameFeedbackScreen', { gameId: gameId || '1' });
//   }, [checkExistingGameFeedback, gameId, isCheckingExistingFeedback, navigation])

//   const resolvedGame = fetchedGame

//   const [authToken, setAuthToken] = useState<string | null>(null)
//   const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)
//   const [loadingVideoId, setLoadingVideoId] = useState<string | null>(null)
//   const [isWarningModalVisible, setWarningModalVisible] = useState(false)
//   const [isImageModalVisible, setImageModalVisible] = useState(false)
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0)


//   const heroImageSource: ImageSourcePropType = useMemo(() => {
//     const primaryMediaImage = resolvedGame?.media?.find(
//       media => media?.type === 'image' && media?.url && media?.is_primary,
//     )
//     const fallbackMediaImage = resolvedGame?.media?.find(
//       media => media?.type === 'image' && media?.url,
//     )

//     if (primaryMediaImage?.url) {
//       return { uri: primaryMediaImage.url }
//     }

//     if (fallbackMediaImage?.url) {
//       return { uri: fallbackMediaImage.url }
//     }

//     if (resolvedGame?.primary_image) {
//       return { uri: resolvedGame.primary_image }
//     }

//     return undefined as unknown as ImageSourcePropType
//   }, [resolvedGame])

//   type GameplayMediaItem = {
//     id: string
//     type: 'image' | 'video'
//     source: ImageSourcePropType
//     videoUrl?: string
//     title?: string | null
//   }

//   const gameplayMedia = useMemo<GameplayMediaItem[]>(
//     () => {
//       if (resolvedGame?.media?.length) {
//         return resolvedGame.media.reduce<GameplayMediaItem[]>((acc, media, index) => {
//           if (media?.type === 'video' && media?.url) {
//             acc.push({
//               id: String(media?.id ?? `video-${index}`),
//               type: 'video',
//               source: heroImageSource,
//               videoUrl: media.url,
//               title: media.title,
//             })
//           } else if (media?.type === 'image' && media?.url) {
//             acc.push({
//               id: String(media?.id ?? `image-${index}`),
//               type: 'image',
//               source: { uri: media.url } as ImageSourcePropType,
//               title: media.title,
//             })
//           }
//           return acc
//         }, [])
//       }

//       return []
//     },
//     [resolvedGame?.media, heroImageSource],
//   )

//   const galleryImages = useMemo<GalleryImageItem[]>(() => {
//     const gallery: GalleryImageItem[] = []
//     const seenSources = new Set<string>()

//     const registerImage = (id: string, source: ImageSourcePropType, title?: string | null, sourceKey?: string) => {
//       const key = sourceKey ?? (typeof source === 'object' && 'uri' in (source as Record<string, unknown>) ? (source as { uri?: string }).uri : undefined) ?? id

//       if (key && seenSources.has(key)) {
//         return
//       }

//       if (key) {
//         seenSources.add(key)
//       }

//       gallery.push({ id, source, title })
//     }

//     if (heroImageSource) {
//       registerImage('hero', heroImageSource, resolvedGame?.name)
//     }

//     resolvedGame?.media?.forEach((media, index) => {
//       if (media?.type === 'image' && media?.url) {
//         registerImage(
//           String(media?.id ?? `media-image-${index}`),
//           { uri: media.url } as ImageSourcePropType,
//           media.title,
//           media.url,
//         )
//       }
//     })

//     return gallery
//   }, [heroImageSource, resolvedGame?.media, resolvedGame?.name])

//   const displayTitle = useMemo(
//     () => resolvedGame?.name ?? gameTitle ?? 'UNTITLED GAME',
//     [resolvedGame?.name, gameTitle],
//   )

//   const displayGenres = useMemo(() => {
//     const categories = resolvedGame?.categories
//       ?.map(category => category?.name)
//       .filter((name): name is string => Boolean(name))
//     if (categories?.length) {
//       return categories.join(', ')
//     }
//     return genre ?? 'Unknown Genre'
//   }, [resolvedGame?.categories, genre])

//   const displayDescription = useMemo(
//     () =>
//       resolvedGame?.short_description ??
//       resolvedGame?.description ??
//       description ??
//       '',
//     [resolvedGame?.short_description, resolvedGame?.description, description],
//   )

//   const displayInfo = useMemo(
//     () =>
//       resolvedGame?.info ??
//       resolvedGame?.description ??
//       resolvedGame?.short_description ??
//       gameInfo ??
//       '',
//     [resolvedGame?.info, resolvedGame?.description, resolvedGame?.short_description, gameInfo],
//   )

//   const formattedReleaseDate = useMemo(() => {
//     if (resolvedGame?.release_date) {
//       return resolvedGame.release_date
//     }
//     return 'TBA'
//   }, [resolvedGame?.release_date])

//   const displayPublisher = useMemo(
//     () => resolvedGame?.publisher?.name ?? 'Unknown Publisher',
//     [resolvedGame?.publisher?.name],
//   )

//   const openImageModal = useCallback(
//     (targetId?: string) => {
//       if (!galleryImages.length) {
//         return
//       }

//       const foundIndex = targetId ? galleryImages.findIndex(imageEntry => imageEntry.id === targetId) : 0
//       setSelectedImageIndex(foundIndex >= 0 ? foundIndex : 0)
//       setImageModalVisible(true)
//     },
//     [galleryImages],
//   )

//   const closeImageModal = useCallback(() => {
//     setImageModalVisible(false)
//   }, [])

//   const handleMediaPress = (mediaItem: GameplayMediaItem) => {
//     if (mediaItem.type === 'image') {
//       openImageModal(mediaItem.id)
//       return
//     }

//     if (mediaItem.type !== 'video' || !mediaItem.videoUrl) {
//       return
//     }

//     const beginPlayback = () => {
//       if (playingVideoId === mediaItem.id) {
//         setPlayingVideoId(null)
//         setLoadingVideoId(null)
//       } else {
//         setPlayingVideoId(mediaItem.id)
//         setLoadingVideoId(mediaItem.id)
//       }
//     }

//     if (authToken) {
//       beginPlayback()
//       return
//     }

//     AsyncStorage.getItem('UserToken')
//       .then(token => {
//         if (token) {
//           setAuthToken(token)
//         }
//         beginPlayback()
//       })
//       .catch(error => {
//         console.warn('Failed to fetch auth token for video:', error)
//         beginPlayback()
//       })
//   }

//   useEffect(() => {
//     let isMounted = true
//     AsyncStorage.getItem('UserToken')
//       .then(token => {
//         if (isMounted && token) {
//           setAuthToken(token)
//         }
//       })
//       .catch(error => {
//         console.warn('Failed to load auth token for video playback:', error)
//       })

//     return () => {
//       isMounted = false
//     }
//   }, [])

//   const launchGame = useCallback(() => {
//     const unityData = {
//       id: gameId,
//       title: displayTitle,
//       genres: displayGenres,
//       description: displayDescription,
//       gameInfo: displayInfo,
//       media: resolvedGame?.media ?? [],
//     }

//     navigation.navigate('UnityPlayScreen', {
//       unityPayload: JSON.stringify(unityData),
//       title: displayTitle,
//     })
//   }, [
//     displayDescription,
//     displayGenres,
//     displayInfo,
//     displayTitle,
//     gameId,
//     navigation,
//     resolvedGame?.media,
//   ])

//   const handleShowWarning = useCallback(() => {
//     setWarningModalVisible(true)
//   }, [])

//   const handleWarningConfirm = useCallback(() => {
//     setWarningModalVisible(false)
//     launchGame()
//   }, [launchGame])

//   const handleWarningDismiss = useCallback(() => {
//     setWarningModalVisible(false)
//   }, [])

//   const headerBackgroundColor = scrollY.interpolate({
//     inputRange: [0, 150],
//     outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)'],
//     extrapolate: 'clamp',
//   })


//   return (
//     <View style={[styles.container,{backgroundColor: Colors.base[950]}]}>
//       {(isFetching && !resolvedGame) && (
//         <View style={styles.loadingOverlay}>
//           <ActivityIndicator size="large" color={Colors.white} />
//         </View>
//       )}
//       <Animated.View 
//         style={[
//           styles.headerBar,
//           { backgroundColor: headerBackgroundColor, height: insets.top + 65}
//         ]}
//       />

//       <TouchableOpacity
//         style={[styles.backButton, { top: insets.top + 10 }]}
//         onPress={() => navigation.goBack()}
//         activeOpacity={0.8}
//       >
//         <BackArrowIcon width={20} height={20} color={Colors.white} />
//       </TouchableOpacity>

//       <Animated.ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//         bounces={false}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: false }
//         )}
//         scrollEventThrottle={16}
//       >

//         {heroImageSource && (
//           <TouchableOpacity
//             activeOpacity={0.9}
//             onPress={() => openImageModal('hero')}
//             style={styles.heroSection}
//           >
//             <Image
//               source={heroImageSource}
//               style={styles.heroImage}
//               resizeMode="cover"
//             />
//           </TouchableOpacity>
//         )}

//         <View style={styles.infoSection}>
//           <UvTypography
//             variant="h3"
//             color={Colors.white}
//             letterSpacing={3}
//             style={styles.gameTitle}
//           >
//             {displayTitle.toUpperCase()}
//           </UvTypography>

//           {displayGenres && (
//             <UvTypography
//               variant="body"
//               color={Colors.base[300]}
//               style={styles.genre}
//             >
//               {displayGenres}
//             </UvTypography>
//           )}

//           {displayDescription && (
//             <UvTypography
//               variant="body"
//               color={Colors.white}
//               style={styles.description}
//             >
//               {displayDescription}
//             </UvTypography>
//           )}
//         </View>

//         {gameplayMedia.length > 0 && (
//           <View style={styles.gameplaySection}>
//             <UvTypography
//               variant="h4"
//               color={Colors.white}
//               letterSpacing={2}
//               style={styles.gameplayTitle}
//             >
//               GAMEPLAY
//             </UvTypography>

//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.gameplayScrollContent}
//               decelerationRate="fast"
//               snapToInterval={GAMEPLAY_CARD_WIDTH + 16}
//               snapToAlignment="start"
//             >
//               {gameplayMedia.map((mediaItem, index) => (
//                 <TouchableOpacity
//                   key={mediaItem.id}
//                   style={[
//                     styles.gameplayCard,
//                     index === 0 && styles.firstGameplayCard,
//                   ]}
//                   activeOpacity={mediaItem.type === 'video' ? 0.8 : 0.9}
//                   onPress={() => handleMediaPress(mediaItem)}
//                 >
//                   {mediaItem.type === 'video' && playingVideoId === mediaItem.id ? (
//                     <View style={styles.inlineVideoContainer}>
//                       <Video
//                         key={mediaItem.id}
//                         source={{ uri: mediaItem.videoUrl }}
//                         style={styles.inlineVideo}
//                         resizeMode="cover"
//                         paused={false}
//                         controls
//                         onLoadStart={() => setLoadingVideoId(mediaItem.id)}
//                         onLoad={() => setLoadingVideoId(null)}
//                         onBuffer={({ isBuffering }) => {
//                           if (isBuffering) {
//                             setLoadingVideoId(mediaItem.id)
//                           } else if (loadingVideoId === mediaItem.id) {
//                             setLoadingVideoId(null)
//                           }
//                         }}
//                         onError={(error) => {
//                           console.warn('Video playback error:', error)
//                           Alert.alert('Playback unavailable', 'We could not play this clip right now. Please try again later.')
//                           setPlayingVideoId(null)
//                           setLoadingVideoId(null)
//                         }}
//                         onEnd={() => {
//                           setPlayingVideoId(null)
//                           setLoadingVideoId(null)
//                         }}
//                       />
//                       {loadingVideoId === mediaItem.id && (
//                         <View style={styles.inlineLoadingOverlay}>
//                           <ActivityIndicator size="large" color={Colors.white} />
//                         </View>
//                       )}
//                     </View>
//                   ) : (
//                     <>
//                       <Image
//                         source={mediaItem.source}
//                         style={styles.gameplayThumbnail}
//                         resizeMode="cover"
//                       />
//                       {mediaItem.type === 'video' && (
//                         <View style={styles.playOverlay}>
//                           <View style={styles.playButton}>
//                             <PlayIcon width={24} height={24} color={Colors.base[950]} />
//                           </View>
//                         </View>
//                       )}
//                     </>
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         )}

//       <View style={styles.gameInfoSection}>
//         <UvTypography
//           variant="h4"
//           color={Colors.white}
//           letterSpacing={2}
//           style={styles.gameInfoTitle}
//         >
//           GAME INFO
//         </UvTypography>

//         {displayInfo ? (
//           <UvTypography
//             variant="body"
//             color={Colors.white}
//             style={styles.gameInfoDescription}
//           >
//             {displayInfo}
//           </UvTypography>
//         ) : (
//           <UvTypography
//             variant="body"
//             color={Colors.base[400]}
//             style={styles.gameInfoDescription}
//           >
//             Details coming soon.
//           </UvTypography>
//         )}

//         <View style={styles.metaRowGroup}>
//           <View style={styles.metaRow}>
//             <UvTypography variant="bodyXs" color={Colors.base[400]}>
//               Release:
//             </UvTypography>
//             <UvTypography variant="body" color={Colors.white} style={styles.metaValue}>
//               {formattedReleaseDate}
//             </UvTypography>
//           </View>

//           <View style={styles.metaRow}>
//             <UvTypography variant="bodyXs" color={Colors.base[400]}>
//               Genres:
//             </UvTypography>
//             <UvTypography variant="body" color={Colors.white} style={styles.metaValue}>
//               {displayGenres}
//             </UvTypography>
//           </View>

//           <View style={styles.metaRow}>
//             <UvTypography variant="bodyXs" color={Colors.base[400]}>
//               Publisher:
//             </UvTypography>
//             <UvTypography variant="body" color={Colors.white} style={styles.metaValue}>
//               {displayPublisher}
//             </UvTypography>
//           </View>
//         </View>
//       </View>

//       </Animated.ScrollView>
//       <View style={styles.bottomButtonContainer}>
//         <UvButton
//           title="Play Now"
//           onPress={handleShowWarning}
//           icon={<PlayIcon width={16} height={16} color={Colors.base[950]} />}
//         />
//         <UvButton
//           title="Feedback"
//           onPress={handleFeedbackPress}
//           variant="secondary"
//           style={styles.feedbackButton}
//           disabled={isCheckingExistingFeedback}
//         />
//       </View>
//       <Modal
//         visible={isWarningModalVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={handleWarningDismiss}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalCard}>
//             <UvTypography
//               variant="h4"
//               color={Colors.danger[500]}
//               style={styles.modalTitle}
//             >
//               WARNING
//             </UvTypography>
//             <UvTypography
//               variant="p"
//               color={Colors.base[100]}
//               style={styles.modalMessage}
//             >
//               Warning : Be aware of your surroundings and that they may change during your gaming experience, be alert, look around at all times. play at your own risk and have fun.
//             </UvTypography>
//             <UvButton
//               title="OK"
//               onPress={handleWarningConfirm}
//               style={styles.modalButton}
//             />
//           </View>
//         </View>
//       </Modal>
//       <UvImageGalleryModal
//         visible={isImageModalVisible}
//         images={galleryImages}
//         initialIndex={selectedImageIndex}
//         onClose={closeImageModal}
//         onIndexChange={setSelectedImageIndex}
//       />
//     </View>
//   )
// }

// export default GameDetailsScreen

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,

//   },
//   headerBar: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 5,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   heroSection: {
//     width: screenWidth,
//     height: screenWidth * 1.2,
//     position: 'relative',
//   },
//   heroImage: {
//     width: '100%',
//     height: '100%',
//   },
//   backButton: {
//     backgroundColor: 'white',
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     left: 20,
//     zIndex: 10,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//   },
//   infoSection: {
//     paddingHorizontal: 20,
//     paddingTop: 24,
//     paddingBottom: 32,
//     alignItems: 'center',
//   },
//   gameTitle: {
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   genre: {
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   description: {
//     textAlign: 'center',
//     lineHeight: 24,
//     opacity: 0.9,
//   },
//   gameplaySection: {
//     paddingBottom: 32,
//   },
//   gameplayTitle: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   gameplayScrollContent: {
//     paddingRight: 20,
//   },
//   gameplayCard: {
//     width: GAMEPLAY_CARD_WIDTH,
//     height: GAMEPLAY_CARD_HEIGHT,
//     marginRight: 16,
//     borderRadius: 12,
//     overflow: 'hidden',
//     backgroundColor: Colors.base[800],
//     position: 'relative',
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//   },
//   firstGameplayCard: {
//     marginLeft: 20,
//   },
//   gameplayThumbnail: {
//     width: '100%',
//     height: '100%',
//   },
//   playOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: Colors.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 4,
//   },
//   gameInfoSection: {
//     paddingHorizontal: 20,
//     paddingBottom: 120,
//   },
//   gameInfoTitle: {
//     marginBottom: 14,
//   },
//   gameInfoDescription: {
//     lineHeight: 22,
//     color: Colors.base[100],
//   },
//   metaRowGroup: {
//     marginTop: 20,
//     gap: 10,
//   },
//   metaRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   metaValue: {
//     marginLeft: 8,
//   },
//   bottomButtonContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//     alignItems: 'flex-end',
//     gap: 12,
//     position: 'absolute',
//     bottom: 20,
//     right: 0,
//     zIndex: 10,
//   },
//   feedbackButton: {
//     marginTop: 0,
//   },
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 15,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//   },
//   inlineVideoContainer: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     backgroundColor: Colors.base[900],
//   },
//   inlineVideo: {
//     width: '100%',
//     height: '100%',
//   },
//   inlineLoadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.35)',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.65)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//   },
//   modalCard: {
//     width: '100%',
//     maxWidth: 420,
//     minHeight: Dimensions.get('window').height * 0.5,
//     borderRadius: 24,
//     backgroundColor: Colors.base[900],
//     padding: 24,
//     justifyContent: 'space-between',
//     shadowColor: '#000',
//     shadowOpacity: 0.35,
//     shadowRadius: 20,
//     shadowOffset: { width: 0, height: 12 },
//     elevation: 10,
//   },
//   modalTitle: {
//     textAlign: 'center',
//     letterSpacing: 2,
//     marginBottom: 16,
//   },
//   modalMessage: {
//     flex: 1,
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   modalButton: {
//     marginTop: 24,
//   },
// })


import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BackArrowIcon from '../../assets/svg/backArrow.svg'
import UvButton from '../../components/common/uvButton'
import UvCachedVideoPlayer from '../../components/common/uvCachedVideoPlayer'
import UvSpacer from '../../components/common/uvSpacer'
import UvTypography from '../../components/common/uvTypography'
import { useGetUserGameFeedbackQuery } from '../../services/feedback/gameFeedbackApi'
import { useGetGameByIdQuery } from '../../services/games/gamesApi'
import Colors from '../../theme/color'
import { RootStackParamList } from '../../types/navigationTypes'
import UvImageGalleryModal, { GalleryImageItem } from '../../components/common/uvImageGalleryModal'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')


type GameDetailsScreenRouteProp = RouteProp<RootStackParamList, 'GameDetailsScreen'>

const GAMEPLAY_CARD_WIDTH = screenWidth * 0.65
const GAMEPLAY_CARD_HEIGHT = GAMEPLAY_CARD_WIDTH * 0.6

const GameDetailsScreen = () => {

  const [isWarningModalVisible, setWarningModalVisible] = useState(false)
  const [isImageModalVisible, setImageModalVisible] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<GameDetailsScreenRouteProp>()
  const { gameTitle, gameImage, genre, description, gameInfo, gameId } = route.params

  const insets = useSafeAreaInsets();

  //Refs
  const scrollY = useRef(new Animated.Value(0)).current

  // Api calls
  const { data: fetchedGame, isFetching } = useGetGameByIdQuery(gameId, {
    skip: !gameId,
  })

  const { data: existingFeedback, isFetching: isCheckingExistingFeedback } = useGetUserGameFeedbackQuery(Number(gameId), {
    skip: !Number(gameId),
  })

  const primaryVideo = useMemo(() => {
    if (!fetchedGame?.media) return null;
    return fetchedGame.media.find(
      media => media.type === 'video' && media.is_primary && media.url
    );
  }, [fetchedGame?.media])

  const thumbnailImage: ImageSourcePropType | null = useMemo(() => {
    if (!fetchedGame?.media) return null;

    const primaryImage = fetchedGame.media.find(
      media => media.type === 'image' && media.is_primary && media.url
    );

    if (primaryImage?.url) {
      return { uri: primaryImage.url };
    }

    const firstImage = fetchedGame.media.find(
      media => media.type === 'image' && media.url
    );

    if (firstImage?.url) {
      return { uri: firstImage.url };
    }

    if (fetchedGame.primary_image) {
      return { uri: fetchedGame.primary_image };
    }

    return null;
  }, [fetchedGame?.media, fetchedGame?.primary_image])

  const displayGenres = useMemo(() => {
    const categories = fetchedGame?.categories
      ?.map(category => category?.name)
      .filter((name): name is string => Boolean(name))
    if (categories?.length) {
      return categories.join(', ')
    }
    return genre ?? 'Unknown Genre'
  }, [fetchedGame?.categories, genre])

  const displayDescription = useMemo(
    () =>
      fetchedGame?.short_description ??
      fetchedGame?.description ??
      description ??
      '',
    [fetchedGame?.short_description, fetchedGame?.description, description],
  )

  const displayInfo = useMemo(
    () =>
      fetchedGame?.info ??
      fetchedGame?.description ??
      fetchedGame?.short_description ??
      gameInfo ??
      '',
    [fetchedGame?.info, fetchedGame?.description, fetchedGame?.short_description, gameInfo],
  )

  const formattedReleaseDate = useMemo(() => {
    if (fetchedGame?.release_date) {
      return fetchedGame.release_date
    }
    return 'TBA'
  }, [fetchedGame?.release_date])

  const displayPublisher = useMemo(
    () => fetchedGame?.publisher?.name ?? 'Unknown Publisher',
    [fetchedGame?.publisher?.name],
  )

  const gameplayMedia = useMemo(() => {
    if (!fetchedGame?.media) return null;
    return fetchedGame.media.filter(media => media.type === 'image');
  }, [fetchedGame?.media])

  const launchGame = useCallback(() => {
    const unityData = {
      id: gameId,
      title: gameTitle,
      genres: displayGenres,
      description: displayDescription,
      gameInfo: displayInfo,
      media: fetchedGame?.media ?? [],
    }

    navigation.navigate('UnityPlayScreen', {
      unityPayload: JSON.stringify(unityData),
      title: gameTitle,
    })
  }, [
    displayDescription,
    displayGenres,
    displayInfo,
    gameTitle,
    gameId,
    navigation,
    fetchedGame?.media,
  ])

    const galleryImages = useMemo<GalleryImageItem[]>(() => {
    const gallery: GalleryImageItem[] = []
    const seenSources = new Set<string>()

    const registerImage = (id: string, source: ImageSourcePropType, title?: string | null, sourceKey?: string) => {
      const key = sourceKey ?? (typeof source === 'object' && 'uri' in (source as Record<string, unknown>) ? (source as { uri?: string }).uri : undefined) ?? id

      if (key && seenSources.has(key)) {
        return
      }

      if (key) {
        seenSources.add(key)
      }

      gallery.push({ id, source, title })
    }

    if (thumbnailImage) {
      registerImage('hero', thumbnailImage, gameTitle)
    }

    fetchedGame?.media?.forEach((media, index) => {
      if (media?.type === 'image' && media?.url) {
        registerImage(
          String(media?.id ?? `media-image-${index}`),
          { uri: media.url } as ImageSourcePropType,
          media.title,
          media.url,
        )
      }
    })

    return gallery
  }, [thumbnailImage, fetchedGame?.media, gameTitle])

  const handleShowWarningModal = useCallback(() => {
    setWarningModalVisible(true)
  }, [])

  const handleWarningConfirm = useCallback(() => {
    setWarningModalVisible(false)
    launchGame()
  }, [launchGame])

  const handleWarningDismiss = useCallback(() => {
    setWarningModalVisible(false)
  }, [])

  const handleImageModalClose = useCallback(() => {
    setImageModalVisible(false)
  }, [setImageModalVisible])


  const handleImageModalOpen = useCallback((index: number) => {
    setImageModalVisible(true)
    setSelectedImageIndex(index)
  }, [setImageModalVisible, setSelectedImageIndex])  

  return (
    <View style={[styles.container, { backgroundColor: Colors.base[950] }]}>
      {(isFetching) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      )}
      <View style={[styles.headerBar, { marginTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <BackArrowIcon width={20} height={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {primaryVideo?.url && thumbnailImage && (
          <UvCachedVideoPlayer
            url={primaryVideo.url}
            thumbnailImage={thumbnailImage}
            fileName={'gameTrailer.mp4'}
            width={screenWidth}
            height={220}
          />
        )}
        <View style={styles.gameInfoContainer}>
          <UvTypography
            variant="h4"
            color={Colors.white}
          >
            {gameTitle}
          </UvTypography>

          {displayGenres && (
            <UvTypography
              variant="body"
              color={Colors.base[300]}
            >
              {displayGenres}
            </UvTypography>
          )}
          <UvSpacer gap={5} />
          <UvButton onPress={handleShowWarningModal} title="Play Now" style={{ width: '100%' }} />
          <UvSpacer gap={5} />
          {existingFeedback && (
            <UvButton
              title="Feedback"
              onPress={() => { navigation.navigate('GameFeedbackScreen', { gameId: String(gameId) }) }}
              variant="secondary"
              style={{ width: '100%' }}
              disabled={isCheckingExistingFeedback}
            />
          )}
          <UvSpacer gap={5} />
          {displayDescription && (
            <UvTypography
              variant="body"
              color={Colors.white}

            >
              {displayDescription}
            </UvTypography>
          )}
        </View>
        <UvSpacer gap={10} />
        {gameplayMedia?.length && gameplayMedia.length > 0 && (
          <>
            <UvTypography
              variant="h4"
              color={Colors.white}
              letterSpacing={2}
              style={styles.gameplayTitle}
            >
              GAMEPLAY
            </UvTypography>
            <UvSpacer gap={2} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={GAMEPLAY_CARD_WIDTH + 16}
              contentContainerStyle={styles.gameplayScrollContent}
              snapToAlignment="start"
            >
              {gameplayMedia.map((media, index) => (
                <TouchableOpacity key={index} style={styles.gameplayCard} onPress={() => handleImageModalOpen(index)}>
                  <Image source={media.url ? { uri: media.url } : require('../../assets/images/Image-not-found.png')} style={styles.gameplayImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
        <UvSpacer gap={12} />
        <View style={styles.gameInfoSection}>
          <UvTypography
            variant="h4"
            color={Colors.white}
            letterSpacing={2}
          >
            GAME INFO
          </UvTypography>
          <UvSpacer gap={2} />
          {displayInfo ? (
            <UvTypography
              variant="body"
              color={Colors.white}
            >
              {displayInfo}
            </UvTypography>
          ) : (
            <UvTypography
              variant="body"
              color={Colors.base[400]}
            >
              Details coming soon.
            </UvTypography>
          )}

          <UvSpacer gap={10} />
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
      <Modal
        visible={isWarningModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleWarningDismiss}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <UvTypography
              variant="h4"
              color={Colors.danger[500]}
              style={styles.modalTitle}
            >
              WARNING
            </UvTypography>
            <UvTypography
              variant="p"
              color={Colors.base[100]}
            >
              Warning : Be aware of your surroundings and that they may change during your gaming experience, be alert, look around at all times. play at your own risk and have fun.
            </UvTypography>
            <UvSpacer gap={10} />
            <UvButton
              title="OK"
              onPress={handleWarningConfirm}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
     <UvImageGalleryModal
        visible={isImageModalVisible}
        images={galleryImages}
        initialIndex={selectedImageIndex}
        onClose={handleImageModalClose}
        onIndexChange={setSelectedImageIndex}
      />
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  headerBar: {
    backgroundColor: Colors.base[950],
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.base[100],
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  gameInfoContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
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
  gameplayImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gameplayScrollContent: {
    paddingHorizontal: 20,
  },
  gameplayTitle: {
    paddingHorizontal: 20,
  },
  gameInfoSection: {
    paddingHorizontal: 20,
  },
  metaRowGroup: {
    gap: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  metaValue: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    backgroundColor: Colors.base[900],
    padding: 24,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  modalTitle: {
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 16,
  },
  modalMessage: {
    flex: 1,
    textAlign: 'center',
  },
  modalButton: {
    width:'50%'
  },
})