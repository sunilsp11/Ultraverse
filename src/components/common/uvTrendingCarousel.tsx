import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View, ImageSourcePropType } from 'react-native'
import Colors from '../../theme/color'
import UvTypography from './uvTypography'
import UvSectionHeader from './uvSectionHeader'

type TrendingGame = {
  id: string
  title: string
  genre: string
  image: ImageSourcePropType
}

type Props = {
  games?: TrendingGame[]
  onGamePress?: (gameId: string) => void
  onPlayPress?: (gameId: string) => void
  title?: string
}

const UvTrendingCarousel: React.FC<Props> = ({
  games = [],
  onGamePress,
  onPlayPress,
  title
}) => {

  return (
    <View style={styles.container}>

      <UvSectionHeader
        title={title ?? ''}
        showViewAll={false}
      />
      <View style={styles.cardsContainer}>
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={styles.gameCard}
            onPress={() => onGamePress?.(game.id)}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              {/* Game Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={game.image}
                  style={styles.gameImage}
                  resizeMode="cover"
                />
              </View>

              {/* Game Info */}
              <View style={styles.gameInfo}>
                <UvTypography
                  variant="body"
                  color={Colors.white}
                  style={styles.gameTitle}
                >
                  {game.title}
                </UvTypography>
                <UvTypography
                  variant="bodyXs"
                  color={Colors.base[400]}
                  style={styles.gameGenre}
                >
                  {game.genre}
                </UvTypography>
              </View>

              {/* Play Button */}
              <TouchableOpacity
                style={styles.playButton}
                onPress={(e) => {
                  e.stopPropagation()
                  onPlayPress?.(game.id)
                }}
              >
                <View style={styles.playIcon} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default UvTrendingCarousel

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  gameCard: {
    backgroundColor: '#00B4FF33',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.base[800],
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
  gameInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  gameGenre: {
    fontSize: 13,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  playIcon: {
    width: 0,
    height: 0,
    marginLeft: 3,
    borderLeftWidth: 12,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: Colors.base[900],
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
})

