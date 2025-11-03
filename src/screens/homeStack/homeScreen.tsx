import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import UvCategoryFilterBar from '../../components/common/uvCategoryFilterBar'
import UvGameCarousel from '../../components/common/uvGameCarousel'
import UvTrendingCarousel from '../../components/common/uvTrendingCarousel'
import UvScreenWrapper from '../../components/common/uvScreenWrapper'
import UvHomeHeader from '../../components/common/uvHomeHeader'
import { HomeStackParamList } from '../../types/navigationTypes'

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>()

  const gamesData: Record<string, {
    title: string;
    image: any;
    genre: string;
    description: string;
  }> = {
    '1': {
      title: 'Fortnite',
      image: require('../../assets/images/Fortnite.png'),
      genre: 'Action - Adventure',
      description: 'Join millions in the world\'s most dynamic battle arena. Build, survive, and dominate in real-world AR zones.',
    },
    '2': {
      title: 'Spider-Man',
      image: require('../../assets/images/Spider-Man.png'),
      genre: 'Action - Adventure',
      description: 'Swing through the city as the legendary Spider-Man. Fight crime, save the city, and experience an epic superhero adventure.',
    },
    '3': {
      title: 'Ghost of Tsushima',
      image: require('../../assets/images/Fortnite.png'),
      genre: 'Action - RPG',
      description: 'Embark on a stunning journey through feudal Japan. Master samurai combat and protect your homeland from invaders.',
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