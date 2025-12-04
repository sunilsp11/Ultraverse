import React, { useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import Sound from 'react-native-sound';
import Colors from '../../theme/color';
import UvTypography from './uvTypography';

interface Props {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: object;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const UvButton: React.FC<Props> = ({
  onPress,
  title,
  variant = 'primary',
  disabled = false,
  style,
  icon,
  iconPosition = 'right',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const buttonPressSoundRef = useRef<Sound | null>(null);

  useEffect(() => {
    // Initialize the sound
    const buttonSound = new Sound('buttom_tab_press.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load button press sound', error);
        return;
      }
      buttonSound.setVolume(0.1);
      buttonPressSoundRef.current = buttonSound;
    });

    // Cleanup on unmount
    return () => {
      if (buttonPressSoundRef.current) {
        buttonPressSoundRef.current.stop();
        buttonPressSoundRef.current.release();
        buttonPressSoundRef.current = null;
      }
    };
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePress = () => {
    // Play sound when button is pressed
    if (buttonPressSoundRef.current) {
      buttonPressSoundRef.current.stop(() => {
        buttonPressSoundRef.current?.play((success) => {
          if (!success) {
            console.log('Failed to play button press sound');
          }
        });
      });
    }

    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        useNativeDriver: true,
        tension: 400,
        friction: 8,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();

    onPress();
  };

  return (
    <View style={[styles.ctaOuter, style]}>
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.ctaInner, variant === 'secondary' && styles.ctaInnerSecondary, disabled && styles.ctaInnerDisabled]}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          disabled={disabled}
        >
          {icon && iconPosition === 'left' && (
            <View style={styles.iconContainerLeft}>{icon}</View>
          )}
          <UvTypography
            variant="body"
            color={variant === 'primary' ? Colors.black : Colors.white}
            align="center"
          >
            {title}
          </UvTypography>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconContainerRight}>{icon}</View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default UvButton;

const styles = StyleSheet.create({
  ctaOuter: {
    alignSelf: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: Colors.white,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 3,
    justifyContent: 'center',
  },
  ctaInner: {
    backgroundColor: Colors.white, 
    height: 33, 
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10, 
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  ctaInnerSecondary: {
    backgroundColor: 'transparent',
    borderColor: Colors.white,
  },
  ctaInnerDisabled: {
    backgroundColor: Colors.base[500],
    borderColor: Colors.base[500],
  },
  iconContainerRight: {
    marginLeft: 8,
  },
  iconContainerLeft: {
    marginRight: 8,
  },
});
