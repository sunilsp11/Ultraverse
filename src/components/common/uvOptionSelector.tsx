import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import UvTypography from './uvTypography';
import Colors from '../../theme/color';

import FlameIcon from '../../assets/svg/flame.svg';
import LaggyIcon from '../../assets/svg/laggyIcon.svg';
import ThumbIcon from '../../assets/svg/thumb.svg';

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
    <View style={styles.stepContent}>
      <UvTypography
        variant="p"
        color={Colors.base[50]}
        align="center"
      >
        {question}
      </UvTypography>

      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          const IconComponent = option.iconName ? iconMap[option.iconName] : undefined;
          const hasIcon = !!IconComponent;

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={[
                hasIcon ? styles.optionButtonWithIcon : styles.optionButton,
                isSelected && (hasIcon ? styles.optionButtonWithIconSelected : styles.optionButtonSelected),
              ]}
              activeOpacity={0.7}
            >
              {hasIcon ? <IconComponent width={24} height={24} /> : null}
              <UvTypography
                variant="body"
                color={isSelected ? Colors.primary[500] : Colors.white}
                style={hasIcon ? styles.optionText : undefined}
              >
                {option.label}
              </UvTypography>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default UvOptionSelector;

const styles = StyleSheet.create({
  stepContent: {
    alignItems: 'center',
    gap: 40,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    width: '100%',
    gap: 16,
    alignItems: 'center',
  },
  optionButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonSelected: {
    borderColor: Colors.primary[500],
    borderWidth: 2,
  },
  optionButtonWithIcon: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.white,
    gap: 12,
  },
  optionButtonWithIconSelected: {
    borderColor: Colors.primary[500],
    borderWidth: 2,
    backgroundColor: 'rgba(0, 0, 0, 100)',
  },
  optionText: {
    marginLeft: 0,
  },
});


