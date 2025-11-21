import React, { useCallback, useMemo, useRef } from "react";
import { ActivityIndicator, Animated, ImageSourcePropType, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UvTrendingCarousel from "../../components/common/uvTrendingCarousel";
import UvHeader from "../../components/common/uvHeader";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvTypography from "../../components/common/uvTypography";
import { RootStackParamList } from "../../types/navigationTypes";
import { Game, useGetTopGamesQuery } from "../../services/games/gamesApi";
import Colors from "../../theme/color";

type GamesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameDetailsScreen'>

const GamesScreen = () => {
  const navigation = useNavigation<GamesScreenNavigationProp>()
  const insets = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current
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

  const gamesById = useMemo(() => {
    return (topGames ?? []).reduce<Record<string, Game>>((acc, game) => {
      acc[String(game.id)] = game
      return acc
    }, {})
  }, [topGames])

  const gamesArray = useMemo(() => {
    return (topGames ?? []).reduce<
      { id: string; title: string; genre: string; image: ImageSourcePropType }[]
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
      })
      return acc
    }, [])
  }, [resolveGameGenre, resolveGameImage, topGames])

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)'],
    extrapolate: 'clamp',
  })

  const handleGamePress = useCallback((gameId: string) => {
    const game = gamesById[gameId]
    if (!game) {
      return
    }

    navigation.navigate('GameDetailsScreen', {
      gameId: String(game.id),
      gameTitle: game.name ?? 'Untitled Game',
      gameImage: resolveGameImage(game),
      genre: resolveGameGenre(game),
      description: game.short_description ?? game.description ?? '',
      gameInfo: game.info ?? '',
    })
  }, [gamesById, navigation, resolveGameGenre, resolveGameImage])

  return (
    <UvScreenWrapper conatinerStyle={styles.container}>
      <Animated.View 
        style={[
          styles.headerBar,
          { backgroundColor: headerBackgroundColor, height: insets.top + 60 }
        ]}
      />
      
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <UvHeader 
          title="GAMES"
          showBackButton={false}
          titleVariant="h6"
          containerStyle={styles.headerContent}
        />
      </View>
      
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {isLoading && !gamesArray.length ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        ) : isError ? (
          <View style={styles.stateContainer}>
            <UvTypography variant="body" style={styles.stateText}>
              Unable to load games right now. Please try again shortly.
            </UvTypography>
          </View>
        ) : (
          <UvTrendingCarousel
            games={gamesArray}
            onGamePress={handleGamePress}
            onPlayPress={handleGamePress}
            title="TOP GAMES"
          />
        )}
      </Animated.ScrollView>
    </UvScreenWrapper>
  );
};

export default GamesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  headerContainer: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
  },
  headerContent: {
    paddingVertical: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  stateContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateText: {
    textAlign: 'center',
    color: Colors.white,
  },
});

