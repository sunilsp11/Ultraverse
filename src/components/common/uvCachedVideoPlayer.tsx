import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, ImageSourcePropType, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import RNFS from 'react-native-fs';
import VideoControls from 'react-native-video-controls';
import Colors from '../../theme/color';
import PlayIcon from '../../assets/svg/playIcon.svg';
import { useAudio } from '../../contexts/audioContext';

interface UvCachedVideoPlayerProps {
    url: string
    fileName?: string
    thumbnailImage: ImageSourcePropType
    width: number
    height: number
    style?: ViewStyle
}


const UvCachedVideoPlayer = ({ url, fileName, thumbnailImage, width, height, style }: UvCachedVideoPlayerProps) => {
    const [videoPath, setVideoPath] = useState<string | null>(null);
    const [userPressedPlay, setUserPressedPlay] = useState(false);
    const [isDownloading, setIsDownloading] = useState(true);
    const { pauseBackgroundMusic, resumeBackgroundMusic } = useAudio();

    useEffect(() => {
        const fetchVideo = async () => {
            setIsDownloading(true);
            try {
                const path = `${RNFS.CachesDirectoryPath}/${fileName}`;
                console.log('Video cache path:', path);

                const fileExists = await RNFS.exists(path);
                console.log('Video exists in cache:', fileExists);

                if (!fileExists) {
                    console.log('Downloading video in background...');
                    await RNFS.downloadFile({ fromUrl: url, toFile: path }).promise;
                    console.log('Video downloaded successfully');
                }

                setVideoPath(path);
            } catch (err) {
                console.error('Error downloading video:', err);
            } finally {
                setIsDownloading(false);
            }
        };

        fetchVideo();
    }, [url, fileName]);

    const handlePlayPress = () => {
        setUserPressedPlay(true);
        pauseBackgroundMusic();
    }

    const handleVideoPlay = () => {
        console.log('Video started playing - pausing background music');
        pauseBackgroundMusic();
    };

    const handleVideoEnd = () => {
        console.log('Video ended - resuming background music');
        resumeBackgroundMusic();
        setUserPressedPlay(false);
    };

    const handleVideoPause = () => {
        console.log('Video paused - resuming background music');
        resumeBackgroundMusic();
    };

    if (!userPressedPlay) {
        return (
            <ImageBackground 
                source={thumbnailImage} 
                style={[styles.container, { width, height, justifyContent: 'center', alignItems: 'center' }]}
            >
                <TouchableOpacity
                    style={styles.playPauseButton}
                    onPress={handlePlayPress}
                >
                    <PlayIcon width={35} height={35} color={Colors.white} />
                </TouchableOpacity>
            </ImageBackground>
        );
    }

    if (isDownloading || !videoPath) {
        return (
            <ImageBackground 
                source={thumbnailImage} 
                style={[styles.container, { width, height, justifyContent: 'center', alignItems: 'center' }]}
            >
                <View style={styles.playPauseButton}>
                    <ActivityIndicator size="large" color={Colors.white} />
                </View>
            </ImageBackground>
        );
    }

    return (
        <View style={[styles.container, { width, height }, style]}>
            <VideoControls
                source={{ uri: videoPath }}
                style={styles.video}
                resizeMode="contain"
                repeat={false}
                tapAnywhereToPause={true}
                playWhenInactive={true}
                disableFullscreen={true}
                disableSeekbar={false}
                disableVolume={false}
                disableTimer={false}
                disableBack={true}
                onPlay={handleVideoPlay}
                onEnd={handleVideoEnd}
                onPause={handleVideoPause}
            />
        </View>
    )
}

export default UvCachedVideoPlayer

const styles = StyleSheet.create({
    video: {
        width: '100%',
        height: '100%',
    },
    playPauseButton: {
        zIndex: 999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        height: 60,
        width: 60,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        backgroundColor: Colors.base[900],
        position: 'relative',
        overflow: 'hidden',
    },
});