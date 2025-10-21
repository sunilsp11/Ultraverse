import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../theme/color';

interface Props {
  onPress: () => void;
}

const UvNextButton: React.FC<Props> = ({ onPress }) => {
  return (
    <View style={styles.wrapper}>
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>→</Text>
    </TouchableOpacity>
    </View>
  );
};

export default UvNextButton;

const styles = StyleSheet.create({
  wrapper: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  container: {
    width: 36,
    height: 36,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  text: {
    color: Colors.black,
    fontSize: 18,
    fontFamily: 'Ronix-Classic',
  },
});


