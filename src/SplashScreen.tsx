import React, { useEffect, useRef } from 'react';
import { Animated, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import Sound from 'react-native-sound';
import Colors from './theme/color';

interface SplashScreenProps {
  onGetStarted: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bgFadeAnim = useRef(new Animated.Value(1)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;
  const soundRef = useRef<Sound | null>(null);

  useEffect(() => {
    // Allow video + sound to play together
    Sound.setCategory(Platform.OS === 'ios' ? 'Playback' : 'Ambient', true);

    // Load and play your audio
    const sound = new Sound('epic_glitch_logo_402329.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('❌ Failed to load sound:', error);
        return;
      }
      sound.setVolume(0.8);
      sound.play((success) => {
        if (success) console.log('✅ Audio finished');
        else console.log('❌ Playback failed');
        sound.release();
      });
    });

    soundRef.current = sound;

    // Start logo animations
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(bgFadeAnim, { toValue: 0.5, duration: 1000, useNativeDriver: false }).start();
      }, 2000);
      setTimeout(() => {
        Animated.timing(buttonFadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
      }, 5000);
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current?.release();
          soundRef.current = null;
        });
      }
    };
  }, []);

  const backgroundColor = bgFadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0.3)', 'rgba(0,0,0,1)'],
  });

  const renderLogo = () => (
    <Animated.View
      style={[
        styles.logoContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Image source={require('../src/assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* ✅ Important Video Fixes */}
      <Video
        source={require('../src/assets/videos/portal_animation.mp4')}
        style={styles.videoBackground}
        resizeMode="cover"
        repeat
        muted={false}
        paused={false}
        playInBackground={true}
        playWhenInactive={true}
        ignoreSilentSwitch="ignore"
        disableFocus={true}  // ✅ prevents Android from stopping video when sound starts
        onError={(e) => console.log('🎥 Video error:', e)}
        onBuffer={(e) => console.log('⏳ Buffering video...', e.isBuffering)}
      />

      <Animated.View style={[styles.overlay, { backgroundColor }]} />
      {renderLogo()}

      <Animated.View style={[styles.buttonShadow, { opacity: buttonFadeAnim }]}>
        <TouchableOpacity onPress={onGetStarted} style={styles.button}>
          <LinearGradient
            colors={['#4A9EFF', '#0066CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 160,
    height: 160,
  },
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  buttonShadow: {
    borderWidth: 1,
    borderColor: Colors.primary[500],
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 4,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
    zIndex: 3,
  },
  button: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  buttonGradient: {
    paddingHorizontal: 35,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
