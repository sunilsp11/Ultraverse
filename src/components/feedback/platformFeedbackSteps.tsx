import React from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import UvTypography from '../common/uvTypography';
import Colors from '../../theme/color';
import UvOptionSelector from '../common/uvOptionSelector';


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
    { label: 'Yes', iconName: 'flame', value: 'Yes' },
    { label: 'No', iconName: 'laggyIcon', value: 'No' },
    { label: 'Somewhat', iconName: 'thumb', value: 'Somewhat' },
  ];

  return (
    <UvOptionSelector
      question="Did the platform feel stable and responsive during gameplay?"
      options={options}
      selectedValue={selectedOption}
      onSelect={onOptionSelect}
    />
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
        autoFocus={true}
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
    { label: 'Yes', iconName: 'flame', value: 'Yes' },
    { label: 'No', iconName: 'laggyIcon', value: 'No' },
    { label: 'Maybe', iconName: 'thumb', value: 'Maybe' },
  ];

  return (
    <UvOptionSelector
      question="Would you recommend Ultraverse to a friend or teammate?"
      options={options}
      selectedValue={selectedOption}
      onSelect={onOptionSelect}
    />
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
});

