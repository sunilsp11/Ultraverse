import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from '../../theme/color';

interface UvAssistantProps {
  onPress?: () => void;
}

const UvAssistant: React.FC<UvAssistantProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.ringCircle} />
    </TouchableOpacity>
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
  ringCircle: {
    width: 48,
    height: 48,
    borderRadius: 50,
    borderWidth: 8, 
    borderColor: Colors.danger[600], 
    backgroundColor: 'transparent',
  },
});
