import React, { ReactNode } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Text from '../common/Typography';

const { width } = Dimensions.get('window');

interface Props {
  title: string;
  description: string;
  afterContent?: ReactNode;
}

const Slide: React.FC<Props> = ({ title, description, afterContent }) => {
  return (
    <View style={styles.container}>
      <Text variant="h3" align="center">
        {title}
      </Text>
      <Text variant="p" color="#CFCFCF" align="center" style={styles.desc}>
        {description}
      </Text>
      {afterContent ? <View style={styles.after}>{afterContent}</View> : null}
    </View>
  );
};

export default Slide;

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desc: {
    marginTop: 8,
  },
  after: {
    marginTop: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


