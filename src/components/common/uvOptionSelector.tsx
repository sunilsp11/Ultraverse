import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import UvTypography from './uvTypography';
import Colors from '../../theme/color';

import FlameIcon from '../../assets/svg/flame.svg';
import LaggyIcon from '../../assets/svg/laggyIcon.svg';
import ThumbIcon from '../../assets/svg/thumb.svg';
import LinearGradient from 'react-native-linear-gradient';

type OptionItem = {
  label: string;
  value: string;
  iconName?: string | null;
};

interface UvOptionSelectorProps {
  question: string;
  options: OptionItem[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  flame: FlameIcon,
  laggyIcon: LaggyIcon,
  thumb: ThumbIcon,
};

const UvOptionSelector: React.FC<UvOptionSelectorProps> = ({
  question,
  options,
  selectedValue,
  onSelect,
}) => {

  return (
    <View style={styles.container}>
      <UvTypography variant="p" color={Colors.base[50]}>{question}</UvTypography>

      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        const IconComponent = option.iconName ? iconMap[option.iconName] : undefined;
        const hasIcon = !!IconComponent;

        return (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.8}
            onPress={() => onSelect(option.value)}
            style={styles.optionWrapper}

          >
            {isSelected ? (
              <LinearGradient
                colors={[Colors.base[950], Colors.primary[800]]}
                locations={[0.4, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientBorder}
              >
                <View >
                  <View style={styles.gradientBackground}>
                    <View style={styles.row}>
                      {hasIcon ? (
                        <IconComponent width={24} height={24} />
                      ) : null}
                      <Text style={[styles.optionText, { color: '#FFFFFF' }]}>
                        {option.label}
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            ) : (
              <View style={styles.unselected}>
                <View style={styles.row}>
                  {hasIcon ? (
                    <IconComponent width={24} height={24} />
                  ) : null}
                  <Text style={[styles.optionText, { color: Colors.base[100] }]}>
                    {option.label}
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default UvOptionSelector;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 14,
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  optionWrapper: {
    marginBottom: 14,
  },
  gradientBorder: {
    borderRadius: 16,
  },
  gradientBackground: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.primary[500],
    borderRadius: 16,
  },
  unselected: {
    borderColor: Colors.base[500],
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#0A0C0D',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '400',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});


