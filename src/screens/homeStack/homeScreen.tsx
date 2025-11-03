import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import UvCategoryFilterBar from '../../components/common/uvCategoryFilterBar'
import UvGameCarousel from '../../components/common/uvGameCarousel'
import UvHomeHeader from '../../components/common/uvHomeHeader'
import UvScreenWrapper from '../../components/common/uvScreenWrapper'
import UvTrendingCarousel from '../../components/common/uvTrendingCarousel'
import { RootStackParamList } from '../../types/navigationTypes'

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameDetailsScreen'>

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>()

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
      description: 'Swing through the city as the legendary Spider-Man. Fight crime, save the city, and experience an epic superhero adventure.',
      gameInfo:'Fortnite is an online video game and game platform developed by Epic Games and released in 2017. It is available in seven distinct game mode versions that otherwise share the same general gameplay and game engine: Fortnite Battle Royale, a battle royale game in which up to 100 players fight to be the last person standing; Fortnite: Save the World, a cooperative hybrid tower defense-shooter and survival game in which up to four players fight off zombie-like creatures and defend objects with traps and fortifications they can build; Fortnite Creative, in which players are given complete freedom to create worlds and battle arenas; Lego Fortnite, an open world game collection divided between survival game Lego Fortnite Odyssey and social game Lego Fortnite Brick Life; Rocket Racing, a racing game; Fortnite Festival, a rhythm game; and Fortnite Ballistic, a tactical first-person shooter currently in early access. All game modes except Save the World are free-to-play.'
    },
    '3': {
      title: 'Ghost of Tsushima',
      image: require('../../assets/images/Fortnite.png'),
      genre: 'Action - RPG',
      description: 'Embark on a stunning journey through feudal Japan. Master samurai combat and protect your homeland from invaders.',
      gameInfo:'Fortnite is an online video game and game platform developed by Epic Games and released in 2017. It is available in seven distinct game mode versions that otherwise share the same general gameplay and game engine: Fortnite Battle Royale, a battle royale game in which up to 100 players fight to be the last person standing; Fortnite: Save the World, a cooperative hybrid tower defense-shooter and survival game in which up to four players fight off zombie-like creatures and defend objects with traps and fortifications they can build; Fortnite Creative, in which players are given complete freedom to create worlds and battle arenas; Lego Fortnite, an open world game collection divided between survival game Lego Fortnite Odyssey and social game Lego Fortnite Brick Life; Rocket Racing, a racing game; Fortnite Festival, a rhythm game; and Fortnite Ballistic, a tactical first-person shooter currently in early access. All game modes except Save the World are free-to-play.'
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
        <UvHomeHeader
          userName="MIKE"
          onSearchPress={() => console.log('Search pressed')}
        />

        <UvCategoryFilterBar
          onCategoryPress={(category) => console.log('Selected:', category)}
          onViewAllPress={() => console.log('View All pressed')}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <UvGameCarousel
            onGamePress={handleGamePress}
            onViewAllPress={() => console.log('View All top games pressed')}
          />

          <UvTrendingCarousel
            onGamePress={handleGamePress}
            onPlayPress={handleGamePress}
          />
        </ScrollView>
      </View>
    </UvScreenWrapper>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
  scrollContent: {
    paddingBottom: 40,
  },
})    