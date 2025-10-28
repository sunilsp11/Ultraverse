import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import Colors from '../../theme/color';
import { Typography, TypographyVariant } from '../../theme/typography';

type Props = RNTextProps & {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  letterSpacing?: number;
};

const UvTypography: React.FC<Props> = ({
  variant = 'body',
  color = Colors.white,
  align,
  style,
  letterSpacing,
  children,
  ...rest
}) => {
  const v = Typography[variant];
  return (
    <RNText
      {...rest}
      style={[
        styles.base,
        {
          fontFamily: v.fontFamily,
          fontSize: v.fontSize,
          lineHeight: v.lineHeight,
          letterSpacing: letterSpacing ?? v.letterSpacing,
          color,
          textAlign: align,
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default UvTypography;


