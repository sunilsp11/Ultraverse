import React, { useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from '../../theme/color';
import Video from 'react-native-video';

interface UvAssistantProps {
  onPress?: () => void;
}

const UvAssistant: React.FC<UvAssistantProps> = ({ onPress }) => {
  const [isVisible, setIsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const videoRef = useRef<any>(null);

  const openContainer = () => {
    setIsVisible(true);
    requestAnimationFrame(() => {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    });
  };

  const closeContainer = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start(({ finished }) => {
      if (finished) {
        setIsVisible(false);
        videoRef.current?.seek(0);
      }
    });
  };

  const handlePress = () => {
    if (isVisible) {
      closeContainer();
    } else {
      openContainer();
    }
    onPress?.();
  };
  
  const scale = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [71, 0], // Start from button center X position
  });

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [216, 0], // Start from button center Y position
  });

  const opacity = slideAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.5, 1],
  });

  return (
    <View style={styles.container}>
      {isVisible && (
        <Animated.View 
          style={[
            styles.viewContainer, 
            { 
              transform: [
                { translateX },
                { translateY },
                { scale },
              ],
              opacity,
            }
          ]}
        >
          <Video
            ref={videoRef}
            source={require("../../assets/videos/aiHealperOnBoard.mp4")}
            style={styles.video}
            resizeMode="contain"
            repeat={false}
            muted={false}
            paused={!isVisible}
            playInBackground={true}
            playWhenInactive={true}
            ignoreSilentSwitch="ignore"
            disableFocus={true}
            onEnd={closeContainer}
            onError={(e) => console.log("🎥 Video error:", e)}
            onBuffer={(e) => console.log("⏳ Buffering video...", e.isBuffering)}
          />
        </Animated.View>
      )}
      <TouchableOpacity
        style={styles.assistantButton}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Image source={require('../../assets/images/uvAiButton.png')} style={styles.assistantImage} />
      </TouchableOpacity>
    </View>
  );
};

export default UvAssistant;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 1000,
  },
  viewContainer: {
    position: 'absolute',
    bottom: 70,
    right: 0,
    zIndex: 1000,
    backgroundColor: Colors.base[900],
    borderRadius: 20,
    overflow: 'hidden',
    width: 250,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
  },
  assistantButton: {
    borderRadius: 100,
    padding: 3,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: Colors.white,
  },
  assistantImage: {
    width: 60,
    height: 60,
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
