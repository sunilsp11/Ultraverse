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

const normalizeOptionLabel = (label: string): string => label.trim().toLowerCase();

const getDefaultIconForOption = (label: string): string | null => {
  const normalizedLabel = normalizeOptionLabel(label);

  if (normalizedLabel === 'yes') {
    return 'flame';
  }

  if (normalizedLabel === 'no') {
    return 'laggyIcon';
  }

  if (['maybe', 'somewhat'].includes(normalizedLabel)) {
    return 'thumb';
  }

  return null;
};

interface PlatformRatingQuestionProps {
  question: string;
  rating: number;
  onRatingChange: (rating: number) => void;
}

export const PlatformRatingQuestion: React.FC<PlatformRatingQuestionProps> = ({
  question,
  rating,
  onRatingChange,
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
      <LeafRating rating={rating} onRatingChange={onRatingChange} />
    </View>
  );
};

interface PlatformMultipleChoiceQuestionProps {
  question: string;
  options: string[] | null | undefined;
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
}

export const PlatformMultipleChoiceQuestion: React.FC<PlatformMultipleChoiceQuestionProps> = ({
  question,
  options,
  selectedOption,
  onOptionSelect,
}) => {
  const formattedOptions = (options ?? []).map(optionLabel => ({
    label: optionLabel,
    value: optionLabel,
    iconName: getDefaultIconForOption(optionLabel),
  }));

  return (
    <UvOptionSelector
      question={question}
      options={formattedOptions}
      selectedValue={selectedOption}
      onSelect={onOptionSelect}
    />
  );
};

interface PlatformTextQuestionProps {
  question: string;
  response: string;
  onResponseChange: (response: string) => void;
  placeholder?: string;
}

export const PlatformTextQuestion: React.FC<PlatformTextQuestionProps> = ({
  question,
  response,
  onResponseChange,
  placeholder = 'Please enter your comments here',
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
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
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

