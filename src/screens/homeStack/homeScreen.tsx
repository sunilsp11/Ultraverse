import { useNavigation } from '@react-navigation/native'
import { CompositeNavigationProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { useMemo } from 'react'
import { Alert, ImageSourcePropType, ScrollView, StyleSheet, View } from 'react-native'
import UvCategoryFilterBar from '../../components/common/uvCategoryFilterBar'
import UvGameCarousel from '../../components/common/uvGameCarousel'
import UvHomeHeader from '../../components/common/uvHomeHeader'
import UvScreenWrapper from '../../components/common/uvScreenWrapper'
import UvTrendingCarousel from '../../components/common/uvTrendingCarousel'
import { RootStackParamList, MainTabParamList } from '../../types/navigationTypes'
import UvSpacer from '../../components/common/uvSpacer'
import { useAppSelector } from '../../store/store'
import { useGetProfileQuery } from '../../services/profile/profileApi'
import { useGetCategoriesQuery } from '../../services/categories/categoriesApi'
import { useGetTopGamesQuery } from '../../services/games/gamesApi'

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<MainTabParamList>
>

type GameDetail = {
  id: string
  title: string
  image: ImageSourcePropType
  genre: string
  description: string
  gameInfo: string
}

const FALLBACK_GAME_IMAGE = require('../../assets/images/Fortnite.png')

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const profileProvider = useAppSelector(state => state.profile.provider)
  const { data: profileData } = useGetProfileQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    skip: profileProvider === 'google',
  })
  const storedCategories = useAppSelector(state => state.categories.categories)
  const shouldSkipCategoriesQuery = storedCategories?.length > 0
  const { data: categoriesData } = useGetCategoriesQuery(undefined, {
    skip: shouldSkipCategoriesQuery,
  })
  const storedGames = useAppSelector(state => state.games.games)
  const shouldSkipGamesQuery = storedGames?.length > 0
  const { data: topGamesData } = useGetTopGamesQuery(undefined, {
    skip: shouldSkipGamesQuery,
  })

  const storedProfile = useAppSelector(state => state.profile.profile)

  const userName = useMemo(() => {
    const activeProfile = profileData ?? storedProfile
    const name = activeProfile?.first_name || activeProfile?.username || 'GAMER'
    return name.toUpperCase()
  }, [profileData?.first_name, profileData?.username, storedProfile?.first_name, storedProfile?.username])

  const resolvedCategories = useMemo(() => {
    if (storedCategories?.length) {
      return storedCategories
    }

    if (categoriesData?.length) {
      return categoriesData
    }

    return []
  }, [categoriesData, storedCategories])

  const categoryNames = useMemo(() => {
    const names = resolvedCategories
      .map(category => category.name || (category as { title?: string }).title || category.slug)
      .filter((name): name is string => Boolean(name))

    return names
  }, [resolvedCategories])

  const shouldRenderCategories = categoryNames.length > 0

  const mapToGameDetails = (games: {
    id?: number | string
    name?: string
    categories?: { name?: string | null }[]
    short_description?: string | null
    description?: string | null
    info?: string | null
    primary_image?: string | null
    media?: { type?: string; url?: string | null; is_primary?: boolean }[]
  }[] = []) =>
    games
      .map(game => ({
        id: game.id != null ? String(game.id) : '',
        title: game.name ?? 'Untitled Game',
        image: (() => {
          const primaryMediaImage = game.media?.find(
            media => media?.type === 'image' && media?.url && media?.is_primary,
          )
          const fallbackMediaImage = game.media?.find(
            media => media?.type === 'image' && media?.url,
          )
          const imageUrl = primaryMediaImage?.url ?? fallbackMediaImage?.url ?? game.primary_image
          return imageUrl ? { uri: imageUrl } : FALLBACK_GAME_IMAGE
        })(),
        genre: game.categories
          ?.map(category => category?.name)
          .filter((name): name is string => Boolean(name))
          .join(', ') || 'Unknown Genre',
        description: game.short_description ?? game.description ?? 'Description coming soon.',
        gameInfo:
          game.info ??
          game.description ??
          game.short_description ??
          'Stay tuned for more details about this game.',
      }))
      .filter(game => game.id !== '')

  const resolvedTopGames: GameDetail[] = useMemo(() => {
    if (storedGames?.length) {
      return mapToGameDetails(storedGames)
    }

    if (topGamesData?.length) {
      return mapToGameDetails(topGamesData)
    }

    return []
  }, [storedGames, topGamesData])

  const carouselGames = useMemo(
    () =>
      resolvedTopGames.map(game => ({
        id: game.id,
        title: game.title,
        image: game.image,
      })),
    [resolvedTopGames],
  )

  const trendingGames = useMemo(
    () =>
      resolvedTopGames.map(game => ({
        id: game.id,
        title: game.title,
        genre: game.genre,
        image: game.image,
      })),
    [resolvedTopGames],
  )

  const gameDetailsMap = useMemo(
    () =>
      resolvedTopGames.reduce<Record<string, GameDetail>>((acc, game) => {
        acc[game.id] = game
        return acc
      }, {}),
    [resolvedTopGames],
  )

  const handleGamePress = (gameId: string) => {
    const game = gameDetailsMap[gameId]
    if (game) {
      navigation.navigate('GameDetailsScreen', {  
        gameId,
        gameTitle: game.title,
        gameImage: game.image,
        genre: game.genre,
        description: game.description,
        gameInfo: game.gameInfo
      })
    }
  }
  return (
      <UvScreenWrapper showAssistant={true}>
      <View style={styles.container}>
        <UvHomeHeader
          userName={userName}
          onSearchPress={() => navigation.navigate('SearchScreen')}
          onProfilePress={() => navigation.navigate('ProfileScreen')}
        />
        <UvSpacer gap={15} />
        {shouldRenderCategories && (
          <>
            <UvCategoryFilterBar
              categories={categoryNames}
              onCategoryPress={(category) => console.log('Selected:', category)}
              onViewAllPress={() => Alert.alert('Upcoming Feature', 'This feature is coming soon.')}
            />
            <UvSpacer gap={15} />
          </>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {carouselGames.length > 0 && (
            <>
              <UvGameCarousel
                games={carouselGames}
                onGamePress={handleGamePress}
                onViewAllPress={() => Alert.alert('Upcoming Feature', 'This feature is coming soon.')}
              />
              <UvSpacer gap={15} />
            </>
          )}
          {trendingGames.length > 0 && (
            <UvTrendingCarousel
              games={trendingGames}
              onGamePress={handleGamePress}
              onPlayPress={handleGamePress}
              title="TRENDING IN ULTRAVERSE"
            />
          )}
        </ScrollView>
      </View>
    </UvScreenWrapper>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
})    