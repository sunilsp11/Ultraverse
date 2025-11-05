import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvFormTextInput from "../../components/common/uvFormTextInput";
import UvTrendingCarousel from "../../components/common/uvTrendingCarousel";
import Colors from "../../theme/color";
import { RootStackParamList } from "../../types/navigationTypes";
import BackArrowIcon from "../../assets/svg/backArrow.svg";

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameDetailsScreen'>

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>()
  const [query, setQuery] = useState("")

  const gamesData = useMemo(() => ([
    {
      id: '1',
      title: 'Fortnite',
      genre: 'Action - Adventure',
      image: require('../../assets/images/Fortnite.png'),
      description: 'Join millions in the world\'s most dynamic battle arena. Build, survive, and dominate in real-world AR zones.',
      gameInfo: 'Fortnite is an online video game and game platform developed by Epic Games and released in 2017. It is available in seven distinct game mode versions that otherwise share the same general gameplay and game engine: Fortnite Battle Royale, a battle royale game in which up to 100 players fight to be the last person standing; Fortnite: Save the World, a cooperative hybrid tower defense-shooter and survival game in which up to four players fight off zombie-like creatures and defend objects with traps and fortifications they can build; Fortnite Creative, in which players are given complete freedom to create worlds and battle arenas; Lego Fortnite, an open world game collection divided between survival game Lego Fortnite Odyssey and social game Lego Fortnite Brick Life; Rocket Racing, a racing game; Fortnite Festival, a rhythm game; and Fortnite Ballistic, a tactical first-person shooter currently in early access. All game modes except Save the World are free-to-play.'
    },
    {
      id: '2',
      title: 'Spider-Man',
      genre: 'Action - Adventure',
      image: require('../../assets/images/Spider-Man.png'),
      description: 'Swing into action in an open-world New York. Fight crime with style and speed.',
      gameInfo: 'Spider-Man is an action-adventure game set in an open-world New York City where players control Spider-Man as he battles iconic villains and navigates a compelling story.'
    },
    {
      id: '3',
      title: 'Ghost of Tsushima',
      genre: 'Action - RPG',
      image: require('../../assets/images/Fortnite.png'),
      description: 'Embark on a stunning journey through feudal Japan. Master samurai combat and protect your homeland from invaders.',
      gameInfo: 'Ghost of Tsushima is an action-adventure game featuring stealth and sword-based combat set on Tsushima Island during the first Mongol invasion of Japan.'
    },
  ]), [])

  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return gamesData
    return gamesData.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.genre.toLowerCase().includes(q)
    )
  }, [gamesData, query])

  const handleGamePress = (gameId: string) => {
    const game = gamesData.find(g => g.id === gameId)
    if (game) {
      navigation.navigate('GameDetailsScreen', {
        gameId: game.id,
        gameTitle: game.title,
        gameImage: game.image,
        genre: game.genre,
        description: game.description,
        gameInfo: game.gameInfo
      })
    }
  }

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
          <UvTrendingCarousel
            title={query ? 'SEARCH RESULTS' : 'ALL GAMES'}
            games={filteredGames}
            onGamePress={handleGamePress}
            onPlayPress={handleGamePress}
          />
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

