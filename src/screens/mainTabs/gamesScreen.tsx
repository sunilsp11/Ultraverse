import React, { useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UvTrendingCarousel from "../../components/common/uvTrendingCarousel";
import UvHeader from "../../components/common/uvHeader";
import UvScreenWrapper from "../../components/common/uvScreenWrapper";
import { RootStackParamList } from "../../types/navigationTypes";

type GamesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameDetailsScreen'>

const GamesScreen = () => {
  const navigation = useNavigation<GamesScreenNavigationProp>()
  const insets = useSafeAreaInsets();
  
  const scrollY = useRef(new Animated.Value(0)).current

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)'],
    extrapolate: 'clamp',
  })

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
    '4': {
      title: 'God of War Ragnarök',
      image: require('../../assets/images/Fortnite.png'),
      genre: 'Action - Adventure',
      description: 'Embark on an epic and heartfelt journey as Kratos and Atreus struggle with holding on and letting go.',
      gameInfo: 'God of War Ragnarök is an action-adventure game developed by Santa Monica Studio. The game is set in ancient Scandinavia and explores Norse mythology as Kratos and his son Atreus embark on a journey to prevent Ragnarök.'
    },
    '5': {
      title: 'The Last of Us Part II',
      image: require('../../assets/images/Fortnite.png'),
      genre: 'Action - Adventure',
      description: 'Five years after their dangerous journey, Ellie embarks on another brutal journey through a post-pandemic America.',
      gameInfo: 'The Last of Us Part II is an action-adventure game featuring elements of the survival horror genre. Set five years after The Last of Us, the player controls Ellie, who sets out in revenge for a murder.'
    },
    '6': {
      title: 'Horizon Forbidden West',
      image: require('../../assets/images/Fortnite.png'),
      genre: 'Action - RPG',
      description: 'Join Aloy as she braves the Forbidden West, a deadly frontier that conceals mysterious new threats.',
      gameInfo: 'Horizon Forbidden West is an action role-playing game where players control Aloy, a hunter in a world overrun by machines. The sequel takes place in a post-apocalyptic version of the western United States.'
    },
    '7': {
      title: 'Elden Ring',
      image: require('../../assets/images/Fortnite.png'),
      genre: 'Action - RPG',
      description: 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring.',
      gameInfo: 'Elden Ring is an action role-playing game developed by FromSoftware. The game is set in the Lands Between, where players control a customizable protagonist on a quest to repair the Elden Ring and become the new Elden Lord.'
    },
    '8': {
      title: 'Red Dead Redemption 2',
      image: require('../../assets/images/Fortnite.png'),
      genre: 'Action - Adventure',
      description: 'Experience the epic story of outlaw Arthur Morgan and the Van der Linde gang.',
      gameInfo: 'Red Dead Redemption 2 is an action-adventure game set in 1899. Players control Arthur Morgan, a member of the Van der Linde gang, as they navigate the decline of the Wild West era.'
    },
    '9': {
      title: 'Cyberpunk 2077',
      image: require('../../assets/images/Fortnite.png'),
      genre: 'Action - RPG',
      description: 'Become a cyberpunk, an urban mercenary equipped with cybernetic enhancements in Night City.',
      gameInfo: 'Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City. Players take on the role of V, a mercenary outlaw going after a one-of-a-kind implant.'
    },
    '10': {
      title: 'Assassin\'s Creed Valhalla',
      image: require('../../assets/images/Fortnite.png'),
      genre: 'Action - RPG',
      description: 'Become Eivor, a legendary Viking raider, and lead your clan from icy Norway to England.',
      gameInfo: 'Assassin\'s Creed Valhalla is an action role-playing game set in 873 AD. Players control Eivor, a Viking raider who becomes embroiled in the conflict between the Assassin Brotherhood and the Templar Order.'
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

  const gamesArray = Object.entries(gamesData).map(([id, game]) => ({
    id,
    title: game.title,
    genre: game.genre,
    image: game.image,
  }))

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
        <UvTrendingCarousel
          games={gamesArray}
          onGamePress={handleGamePress}
          onPlayPress={handleGamePress}
          title="TOP GAMES"
        />
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
});

