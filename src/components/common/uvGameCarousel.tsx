import React from 'react'
import { StyleSheet, View, ScrollView, Image, Dimensions, TouchableOpacity, ImageSourcePropType } from 'react-native'
import UvSectionHeader from './uvSectionHeader'

const { width: screenWidth } = Dimensions.get('window')
const CARD_WIDTH = screenWidth * 0.42
const CARD_HEIGHT = CARD_WIDTH * 1.2

type GameData = {
    id: string
    title: string
    image: ImageSourcePropType
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
                {games.map((game, index) => (
                    <TouchableOpacity
                        key={game.id}
                        style={[
                            styles.gameCard,
                            index === 0 && styles.firstCard,
                            index === games.length - 1 && styles.lastCard,
                        ]}
                        onPress={() => onGamePress?.(game.id)}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={game.image}
                            style={styles.gameImage}
                            resizeMode="stretch"

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