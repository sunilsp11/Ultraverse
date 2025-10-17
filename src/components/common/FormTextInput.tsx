import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import Colors from '../../theme/color';
import { Typography, TypographyVariant } from '../../theme/typography';

type Props = TextInputProps & {
  label?: string;
  wrapperStyle?: object;
  variant?: TypographyVariant; 
  placeholderColor?: string;
};

const FormTextInput: React.FC<Props> = ({ label, wrapperStyle, style, variant = 'body', placeholderColor, ...rest }) => {
  const v = Typography[variant];
  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <TextInput
        style={[
          styles.input,
          {
            fontFamily: v.fontFamily,
            fontSize: v.fontSize,
            lineHeight: v.lineHeight,
            letterSpacing: v.letterSpacing,
          },
          style,
        ]}
        placeholderTextColor={placeholderColor ?? '#8FA8B3'}
        {...rest}
      />
    </View>
  );
};

export default FormTextInput;

const styles = StyleSheet.create({
  wrapper: {
    height: 40,
    backgroundColor: Colors.black,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  input: {
    color: Colors.white,
    padding: 0,
  },
});


