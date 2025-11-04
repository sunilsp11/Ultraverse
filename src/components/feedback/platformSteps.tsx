import React from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import UvTypography from '../common/uvTypography';
import Colors from '../../theme/color';
import FlameIcon from '../../assets/svg/flame.svg';
import LaggyIcon from '../../assets/svg/laggyIcon.svg';
import ThumbIcon from '../../assets/svg/thumb.svg';


interface LeafRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const LeafRating: React.FC<LeafRatingProps> = ({ rating, onRatingChange }) => {
  return (
    <View style={styles.leafContainer}>
      {[1, 2, 3, 4, 5].map((leafIndex) => {
        const isSelected = rating === leafIndex;
        return (
          <TouchableOpacity
            key={leafIndex}
            onPress={() => onRatingChange(leafIndex)}
            activeOpacity={0.7}
            style={styles.leafButton}
          >
            <View style={styles.leafNumberContainerWrapper}>
              <View style={[styles.leafNumberContainer, { backgroundColor: isSelected ? Colors.primary[600] : Colors.base[50] }]}>
                <UvTypography
                  variant="body"
                  color={isSelected ? Colors.white : Colors.base[950]}
                  
                >
                  {leafIndex}
                </UvTypography>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};


interface PlatformStep1Props {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export const PlatformStep1: React.FC<PlatformStep1Props> = ({ rating, onRatingChange }) => {
  return (
    <View style={styles.stepContent}>
      <UvTypography
        variant="p"
        color={Colors.base[50]}
        align="center"
      >
        How easy was it to launch and access this game from the Ultraverse platform?
      </UvTypography>
      <LeafRating rating={rating} onRatingChange={onRatingChange} />
    </View>
  );
};

interface PlatformStep2Props {
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
}

export const PlatformStep2: React.FC<PlatformStep2Props> = ({
  selectedOption,
  onOptionSelect,
}) => {
  const options = [
    { label: 'Yes', icon: FlameIcon, value: 'Yes' },
    { label: 'No', icon: LaggyIcon, value: 'No' },
    { label: 'Somewhat', icon: ThumbIcon, value: 'Somewhat' },
  ];

  return (
    <View style={styles.stepContent}>
      <UvTypography
        variant="p"
        color={Colors.base[50]}
        align="center"
      >
        Did the platform feel stable and responsive during gameplay?
      </UvTypography>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedOption === option.value;
          const IconComponent = option.icon;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onOptionSelect(option.value)}
              style={[
                styles.optionButtonWithIcon,
                isSelected && styles.optionButtonWithIconSelected,
              ]}
              activeOpacity={0.7}
            >
              <IconComponent width={24} height={24} />
              <UvTypography
                variant="body"
                color={isSelected ? Colors.primary[500] : Colors.white}
                style={styles.optionText}
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


interface PlatformStep3Props {
  response: string;
  onResponseChange: (response: string) => void;
}

export const PlatformStep3: React.FC<PlatformStep3Props> = ({ response, onResponseChange }) => {
  return (
    <View style={styles.stepContent}>
      <UvTypography
        variant="p"
        color={Colors.base[50]}
        align="center"
      >
        What improvement would make the Ultraverse platform better for you?
      </UvTypography>
      <TextInput
        style={styles.textInput}
        placeholder="Please enter your comments here"
        placeholderTextColor={Colors.base[400]}
        value={response}
        onChangeText={onResponseChange}
        multiline
        textAlignVertical="top"
        numberOfLines={4}
      />
    </View>
  );
};


interface PlatformStep4Props {
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
}

export const PlatformStep4: React.FC<PlatformStep4Props> = ({
  selectedOption,
  onOptionSelect,
}) => {
  const options = [
    { label: 'Yes', icon: FlameIcon, value: 'Yes' },
    { label: 'No', icon: LaggyIcon, value: 'No' },
    { label: 'Maybe', icon: ThumbIcon, value: 'Maybe' },
  ];

  return (
    <View style={styles.stepContent}>
      <UvTypography
        variant="p"
        color={Colors.base[50]}
        align="center"
      >
        Would you recommend Ultraverse to a friend or teammate?
      </UvTypography>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedOption === option.value;
          const IconComponent = option.icon;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onOptionSelect(option.value)}
              style={[
                styles.optionButtonWithIcon,
                isSelected && styles.optionButtonWithIconSelected,
              ]}
              activeOpacity={0.7}
            >
              <IconComponent width={24} height={24} />
              <UvTypography
                variant="body"
                color={isSelected ? Colors.primary[500] : Colors.white}
                style={styles.optionText}
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

interface PlatformStep5Props {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export const PlatformStep5: React.FC<PlatformStep5Props> = ({ rating, onRatingChange }) => {
  return (
    <View style={styles.stepContent}>
      <UvTypography
        variant="p"
        color={Colors.base[50]}
        align="center"
      >
        How was your experience sharing AR gameplay and interacting with friends across multiple games within the Ultraverse platform?
      </UvTypography>
      <LeafRating rating={rating} onRatingChange={onRatingChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  stepContent: {
    alignItems: 'center',
    gap: 40,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  leafNumberContainerWrapper: {
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.white,
    width: 37,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  leafContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafButton: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },

  leafNumberContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 29,
    height: 40,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
  },

  textInput: {
    width: '100%',
    height: 100,
    backgroundColor: Colors.base[800],
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    padding: 16,
    color: Colors.white,
    fontFamily: 'FormaDJR-Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 1,
    fontWeight: '400',
    borderWidth: 1,
    borderColor: Colors.base[700],
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
  },
  optionText: {
    marginLeft: 0,
  },
});

