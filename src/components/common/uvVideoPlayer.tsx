import React, { useState } from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import VideoControls from 'react-native-video-controls';
import PlayIcon from '../../assets/svg/playIcon.svg';
import Colors from '../../theme/color';

interface UvVideoPlayerProps {
  videoUrl: string
  thumbnailImage: ImageSourcePropType
  width: number
  height: number
  style?: ViewStyle
  borderRadius?: number
}

const UvVideoPlayer: React.FC<UvVideoPlayerProps> = ({
  videoUrl,
  thumbnailImage,
  width,
  height,
  style,
  borderRadius = 0,
}) => {
  const [isVideoLoading, setIsVideoLoading] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)

  const handlePlayPause = () => {
    if (!shouldLoadVideo) {
      setShouldLoadVideo(true)
      setIsVideoLoading(true)
    } else {
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <>
        {!shouldLoadVideo
          ? <ImageBackground source={thumbnailImage} style={styles.thumbnail}>
            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={handlePlayPause}
            >
              <PlayIcon width={35} height={35} color={Colors.white} />
            </TouchableOpacity>
          </ImageBackground>
          :
          <>
          <VideoControls
            source={{ uri: videoUrl }}
            style={[styles.video, { borderRadius }]}
            resizeMode="cover"
            repeat
            muted
            tapAnywhereToPause={true}
            playWhenInactive={true}
            disableFullscreen={true}
            disableSeekbar={false}
            disableVolume={true}
            disableTimer={true}
            disableBack={true}
            onBuffer={({ isBuffering }) => setIsVideoLoading(isBuffering)}
            onError={(error) => {
              console.warn('Video playback error:', error)
              setIsVideoLoading(false)
              setShouldLoadVideo(false)
            }}
            onLoad={() => {
              setIsVideoLoading(false)
              setIsVideoPlaying(true)
            }}
          />
          {/* {isVideoLoading && (
            <View style={styles.playPauseButton}>
              <ActivityIndicator size="large" color={Colors.base[950]} />
            </View>
          )} */}
          </>
        }
      </>
    </View>
  )
}

export default UvVideoPlayer

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.base[900],
    position: 'relative',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playPauseButton: {
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height: 60,
    width: 60,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems:'center',
    justifyContent:'center'
  },
})
