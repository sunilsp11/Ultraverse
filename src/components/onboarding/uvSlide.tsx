import React, { ReactNode } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import UvTypography from '../common/uvTypography';

const { width } = Dimensions.get('window');

interface Props {
  title: string;
  description: string;
  afterContent?: ReactNode;
}

const UvSlide: React.FC<Props> = ({ title, description, afterContent }) => {
  return (
    <View style={styles.container}>
      <UvTypography variant="h3" align="center">
        {title}
      </UvTypography>
      <UvTypography variant="p" color="#CFCFCF" align="center" style={styles.desc}>
        {description}
      </UvTypography>
      {afterContent ? <View style={styles.after}>{afterContent}</View> : null}
    </View>
  );
};

export default UvSlide;

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


