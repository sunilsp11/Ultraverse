import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, ImageSourcePropType, ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvFormTextInput from "../../components/common/uvFormTextInput";
import UvTrendingCarousel from "../../components/common/uvTrendingCarousel";
import Colors from "../../theme/color";
import { RootStackParamList } from "../../types/navigationTypes";
import BackArrowIcon from "../../assets/svg/backArrow.svg";
import UvTypography from "../../components/common/uvTypography";
import { Game, useGetTopGamesQuery } from "../../services/games/gamesApi";

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameDetailsScreen'>

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>()
  const [query, setQuery] = useState("")
  const { data: topGames, isLoading, isError } = useGetTopGamesQuery()

  const resolveGameImage = useCallback((game: Game): ImageSourcePropType | undefined => {
    if (game?.primary_image) {
      return { uri: game.primary_image }
    }

    const primaryMediaImage = game?.media?.find(
      media => media?.type === 'image' && media?.is_primary && media?.url,
    )

    if (primaryMediaImage?.url) {
      return { uri: primaryMediaImage.url }
    }

    const fallbackMediaImage = game?.media?.find(
      media => media?.type === 'image' && media?.url,
    )

    if (fallbackMediaImage?.url) {
      return { uri: fallbackMediaImage.url }
    }

    return undefined
  }, [])

  const resolveGameGenre = useCallback((game: Game) => {
    const categories = game?.categories
      ?.map(category => category?.name)
      .filter((name): name is string => Boolean(name))

    return categories?.length ? categories.join(', ') : 'Coming Soon'
  }, [])

  const gamesData = useMemo(() => {
    return (topGames ?? []).reduce<
      {
        id: string
        title: string
        genre: string
        image: ImageSourcePropType
        description: string
        gameInfo: string
      }[]
    >((acc, game) => {
      const image = resolveGameImage(game)
      if (!image) {
        return acc
      }

      acc.push({
        id: String(game.id),
        title: game.name ?? 'Untitled Game',
        genre: resolveGameGenre(game),
        image,
        description: game.short_description ?? game.description ?? '',
        gameInfo: game.info ?? '',
      })

      return acc
    }, [])
  }, [resolveGameGenre, resolveGameImage, topGames])

  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return gamesData
    return gamesData.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.genre.toLowerCase().includes(q)
    )
  }, [gamesData, query])

  const gamesById = useMemo(() => {
    return filteredGames.reduce<Record<string, typeof filteredGames[number]>>((acc, game) => {
      acc[game.id] = game
      return acc
    }, {})
  }, [filteredGames])

  const handleGamePress = useCallback((gameId: string) => {
    const game = gamesById[gameId]
    if (!game) {
      return
    }

    navigation.navigate('GameDetailsScreen', {
      gameId: game.id,
      gameTitle: game.title,
      gameImage: game.image,
      genre: game.genre,
      description: game.description,
      gameInfo: game.gameInfo
    })
  }, [gamesById, navigation])

  const stateContent = useMemo(() => {
    if (isLoading && !gamesData.length) {
      return (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      )
    }

    if (isError) {
      return (
        <View style={styles.stateContainer}>
          <UvTypography variant="body" style={styles.stateText}>
            Unable to load games. Please try again shortly.
          </UvTypography>
        </View>
      )
    }

    if (!filteredGames.length) {
      return (
        <View style={styles.stateContainer}>
          <UvTypography variant="body" style={styles.stateText}>
            No games match your search.
          </UvTypography>
        </View>
      )
    }

    return (
      <UvTrendingCarousel
        title={query ? 'SEARCH RESULTS' : 'ALL GAMES'}
        games={filteredGames.map(({ id, title, genre, image }) => ({
          id,
          title,
          genre,
          image,
        }))}
        onGamePress={handleGamePress}
        onPlayPress={handleGamePress}
      />
    )
  }, [filteredGames, gamesData.length, handleGamePress, isError, isLoading, query])

  return (
    <UvScreenWrapper>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.backButton}>
              <BackArrowIcon width={20} height={20} />
            </TouchableOpacity>
            <UvFormTextInput
              placeholder="Search games"
              value={query}
              onChangeText={setQuery}
              wrapperStyle={styles.searchInput}
              returnKeyType="search"
            />
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {stateContent}
        </ScrollView>
      </View>
    </UvScreenWrapper>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  searchInput: {
    height: 44,
    flex: 1,
    marginLeft: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  stateContainer: {
    paddingTop: 40,
    paddingBottom: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateText: {
    color: Colors.white,
    textAlign: 'center',
  },
  backButton: {
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
});

