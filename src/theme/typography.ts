export type TypographyVariant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p'
    | 'body'
    | 'bodyXs'

export type FontWeightName = 'regular' | 'bold' | 'heavy' | '700' | '600' | '500' | '400' | '300' | '200' | '100';

export const FontFamilies = {
    display: 'Ronix-Classic',
    bodyRegular: 'FormaDJR-Regular',
    bodyBold: 'FormaDJR-Bold',
} as const;

export type TypographyStyle = {
    fontFamily: string;
    fontSize: number;
    lineHeight?: number;
    letterSpacing?: number;
    fontWeight?: FontWeightName;
};

export const Typography: Record<TypographyVariant, TypographyStyle> = {
    h1: {
        fontFamily: FontFamilies.display,
        fontSize: 40,
        lineHeight: 48,
        letterSpacing: 0.2,
        fontWeight: '700',
    },
    h2: {
        fontFamily: FontFamilies.display,
        fontSize: 32,
        lineHeight: 40,
        letterSpacing: 0.2,
        fontWeight: '700',
    },
    h3: {
        fontFamily: FontFamilies.display,
        fontSize: 28,
        lineHeight: 36,
        letterSpacing: 0.3,
        fontWeight: '600',
    },
    h4: {
        fontFamily: FontFamilies.display,
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: 0.3,
        fontWeight: '600',
    },
    h5: {
        fontFamily: FontFamilies.display,
        fontSize: 18,
        lineHeight: 26,
        letterSpacing: 0.4,
        fontWeight: '500',
    },
    h6: {
        fontFamily: FontFamilies.display,
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.4,
        fontWeight: '500',
    },
    p: {
        fontFamily: FontFamilies.bodyRegular,
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 1,
        fontWeight: '400',
    },
    body: {
        fontFamily: FontFamilies.bodyRegular,
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 1,
        fontWeight: '400',
    },
    bodyXs: {
        fontFamily: FontFamilies.bodyRegular,
        fontSize: 12,
        lineHeight: 18,
        letterSpacing: 1,
        fontWeight: '400',
    },
};


