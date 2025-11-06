import React from 'react'
import { StyleSheet, View, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'
import UvSectionHeader from './uvSectionHeader'

const { width: screenWidth } = Dimensions.get('window')
const CARD_WIDTH = screenWidth * 0.42
const CARD_HEIGHT = CARD_WIDTH * 1.2

type GameData = {
    id: string
    title: string
    image: any
}

type Props = {
    games?: GameData[]
    onGamePress?: (gameId: string) => void
    onViewAllPress?: () => void
}

const UvGameCarousel: React.FC<Props> = ({
    games = [],
    onGamePress,
    onViewAllPress
}) => {
    const defaultGames: GameData[] = [
        {
            id: '1',
            title: 'Fortnite',
            image: require('../../assets/images/Fortnite.png'),
        },
        {
            id: '2',
            title: 'Spider-Man',
            image: require('../../assets/images/Spider-Man.png'),
        },
        {
            id: '3',
            title: 'Ghost of Tsushima',
            image: require('../../assets/images/Fortnite.png'),
        },
    ]

    const displayGames = games.length > 0 ? games : defaultGames

    return (
        <View style={styles.container}>
            <UvSectionHeader
                title="TOP GAMES"
                onViewAllPress={onViewAllPress}
            />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + 16}
                snapToAlignment="start"
            >
                {displayGames.map((game, index) => (
                    <TouchableOpacity
                        key={game.id}
                        style={[
                            styles.gameCard,
                            index === 0 && styles.firstCard,
                            index === displayGames.length - 1 && styles.lastCard,
                        ]}
                        onPress={() => onGamePress?.(game.id)}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={game.image}
                            style={styles.gameImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

export default UvGameCarousel

const styles = StyleSheet.create({
    container: {
    },
    scrollContent: {
        paddingRight: 20,
    },
    gameCard: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginRight: 16,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#1F2937',
    },
    firstCard: {
        marginLeft: 20,
    },
    lastCard: {
        marginRight: 0,
    },
    gameImage: {
        width: '100%',
        height: '100%',
    },
})