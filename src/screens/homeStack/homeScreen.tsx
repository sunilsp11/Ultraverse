import { useNavigation } from '@react-navigation/native'
import { CompositeNavigationProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import React, { useMemo } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import UvCategoryFilterBar from '../../components/common/uvCategoryFilterBar'
import UvGameCarousel from '../../components/common/uvGameCarousel'
import UvHomeHeader from '../../components/common/uvHomeHeader'
import UvScreenWrapper from '../../components/common/uvScreenWrapper'
import UvTrendingCarousel from '../../components/common/uvTrendingCarousel'
import { RootStackParamList, MainTabParamList } from '../../types/navigationTypes'
import UvSpacer from '../../components/common/uvSpacer'
import { useAppSelector } from '../../store/store'
import { useGetProfileQuery } from '../../services/profile/profileApi'

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<MainTabParamList>
>

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const { data: profileData } = useGetProfileQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  })

  const storedProfile = useAppSelector(state => state.profile.profile)

  const userName = useMemo(() => {
    const activeProfile = profileData ?? storedProfile
    const name = activeProfile?.first_name || activeProfile?.username || 'GAMER'
    return name.toUpperCase()
  }, [profileData?.first_name, profileData?.username, storedProfile?.first_name, storedProfile?.username])

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
      <UvScreenWrapper showAssistant={true}>
      <View style={styles.container}>
        <UvHomeHeader
          userName={userName}
          onSearchPress={() => navigation.navigate('SearchScreen')}
          onProfilePress={() => navigation.navigate('ProfileScreen')}
        />
        <UvSpacer gap={15} />
        <UvCategoryFilterBar
          onCategoryPress={(category) => console.log('Selected:', category)}
          onViewAllPress={() => Alert.alert('Upcoming Feature', 'This feature is coming soon.')}
        />
        <UvSpacer gap={15} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <UvGameCarousel
            onGamePress={handleGamePress}
            onViewAllPress={() => Alert.alert('Upcoming Feature', 'This feature is coming soon.')}
          />
          <UvSpacer gap={15} />
          <UvTrendingCarousel
            onGamePress={handleGamePress}
            onPlayPress={handleGamePress}
            title="TRENDING IN ULTRAVERSE"
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
  },
  scrollContent: {
    paddingBottom: 40,
  },
})    