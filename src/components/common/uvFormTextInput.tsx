import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../theme/color';
import { Typography, TypographyVariant } from '../../theme/typography';
import EyeIcon from '../../assets/svg/eye.svg';
import EyeOffIcon from '../../assets/svg/eyeOff.svg';

type Props = TextInputProps & {
  label?: string;
  wrapperStyle?: object;
  variant?: TypographyVariant; 
  placeholderColor?: string;
  showPasswordToggle?: boolean;
};

const UvFormTextInput: React.FC<Props> = ({ 
  label, 
  wrapperStyle, 
  style, 
  variant = 'body', 
  placeholderColor, 
  showPasswordToggle = false,
  secureTextEntry,
  ...rest 
}) => {
  const v = Typography[variant];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

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
        secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
        {...rest}
      />
      {showPasswordToggle && (
        <TouchableOpacity 
          style={styles.passwordToggle} 
          onPress={togglePasswordVisibility}
          activeOpacity={0.7}
        >
          {isPasswordVisible ? (
            <EyeOffIcon width={20} height={20} fill="#8FA8B3" />
          ) : (
            <EyeIcon width={20} height={20} fill="#8FA8B3" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UvFormTextInput;

const styles = StyleSheet.create({
  wrapper: {
    height: 40,
    backgroundColor: Colors.black,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    color: Colors.white,
    padding: 0,
    flex: 1,
  },
  passwordToggle: {
    padding: 4,
    marginLeft: 8,
  },
});


