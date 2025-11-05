import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import UvTrendingCarousel from "../../components/common/uvTrendingCarousel";
import { RootStackParamList } from "../../types/navigationTypes";

type GamesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameDetailsScreen'>

const GamesScreen = () => {
  const navigation = useNavigation<GamesScreenNavigationProp>()

  const gamesData: Record<string, {
    title: string;
    image: any;
    genre: string;
    description: string;
    gameInfo: string
  }> = {
    '1': {
      title: 'Fortnite',
      image: require('../../assets/images/Fortnite.png'),
      genre: 'Action - Adventure',
      description: 'Join millions in the world\'s most dynamic battle arena. Build, survive, and dominate in real-world AR zones.',
      gameInfo: 'Fortnite is an online video game and game platform developed by Epic Games and released in 2017. It is available in seven distinct game mode versions that otherwise share the same general gameplay and game engine: Fortnite Battle Royale, a battle royale game in which up to 100 players fight to be the last person standing; Fortnite: Save the World, a cooperative hybrid tower defense-shooter and survival game in which up to four players fight off zombie-like creatures and defend objects with traps and fortifications they can build; Fortnite Creative, in which players are given complete freedom to create worlds and battle arenas; Lego Fortnite, an open world game collection divided between survival game Lego Fortnite Odyssey and social game Lego Fortnite Brick Life; Rocket Racing, a racing game; Fortnite Festival, a rhythm game; and Fortnite Ballistic, a tactical first-person shooter currently in early access. All game modes except Save the World are free-to-play.'
    },
    '2': {
      title: 'Spider-Man',
      image: require('../../assets/images/Spider-Man.png'),
      genre: 'Action - Adventure',
      description: 'Swing into action in an open-world New York. Fight crime with style and speed.',
      gameInfo: 'Spider-Man is an action-adventure game set in an open-world New York City where players control Spider-Man as he battles iconic villains and navigates a compelling story.'
    },
    '3': {
      title: 'Ghost of Tsushima',
      image: require('../../assets/images/Fortnite.png'),
      genre: 'Action - RPG',
      description: 'Embark on a stunning journey through feudal Japan. Master samurai combat and protect your homeland from invaders.',
      gameInfo: 'Ghost of Tsushima is an action-adventure game featuring stealth and sword-based combat set on Tsushima Island during the first Mongol invasion of Japan.'
    },
  }

  const handleGamePress = (gameId: string) => {
    const game = gamesData[gameId as keyof typeof gamesData]
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
    <UvScreenWrapper>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <UvTrendingCarousel
            onGamePress={handleGamePress}
            onPlayPress={handleGamePress}
            title="TOP GAMES"
          />
        </ScrollView>
      </View>
    </UvScreenWrapper>
  );
};

export default GamesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 32,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

