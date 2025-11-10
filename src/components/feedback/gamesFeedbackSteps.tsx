import React from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import UvTypography from '../common/uvTypography';
import Colors from '../../theme/color';
import Svg, { Path } from 'react-native-svg';
import UvOptionSelector from '../common/uvOptionSelector';


interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map(starIndex => {
        const isFilled = starIndex <= rating;
        return (
          <TouchableOpacity
            key={starIndex}
            onPress={() => onRatingChange(starIndex)}
            activeOpacity={0.7}
            style={styles.starButton}
          >
            <Svg width={34} height={33} viewBox="0 0 34 33" fill="none">
              <Path
                d="M16.4697 0.846191C16.6194 0.385536 17.2712 0.385536 17.4209 0.846191L20.7354 11.0474C20.9362 11.6654 21.5123 12.0835 22.1621 12.0835H32.8887C33.373 12.0835 33.5745 12.7041 33.1826 12.9888L24.5049 19.2935C23.9792 19.6754 23.7592 20.3522 23.96 20.9702L27.2744 31.1724C27.4237 31.6329 26.8966 32.0156 26.5049 31.731L17.8271 25.4263C17.3014 25.0443 16.5892 25.0443 16.0635 25.4263L7.38574 31.731C6.99399 32.0156 6.46693 31.6329 6.61621 31.1724L9.93066 20.9702C10.1315 20.3522 9.91146 19.6754 9.38574 19.2935L0.708008 12.9888C0.316151 12.7041 0.517592 12.0835 1.00195 12.0835H11.7285C12.3783 12.0835 12.9545 11.6654 13.1553 11.0474L16.4697 0.846191Z"
                fill={isFilled ? '#FDD836' : 'transparent'}
                stroke={isFilled ? '#FDD836' : Colors.white}
                strokeWidth={1}
              />
            </Svg>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

interface GameRatingQuestionProps {
  question: string;
  rating: number;
  onRatingChange: (rating: number) => void;
}

export const GameRatingQuestion: React.FC<GameRatingQuestionProps> = ({
  question,
  rating,
  onRatingChange,
}) => {
  return (
    <View style={styles.stepContent}>
      <UvTypography variant="p" color={Colors.base[50]} align="center">
        {question}
      </UvTypography>
      <StarRating rating={rating} onRatingChange={onRatingChange} />
    </View>
  );
};

interface GameTextQuestionProps {
  question: string;
  response: string;
  onResponseChange: (response: string) => void;
  placeholder?: string;
}

export const GameTextQuestion: React.FC<GameTextQuestionProps> = ({
  question,
  response,
  onResponseChange,
  placeholder = 'Please enter your comments here',
}) => {
  return (
    <View style={styles.stepContent}>
      <UvTypography variant="p" color={Colors.base[50]} align="center">
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

interface GameMultipleChoiceQuestionProps {
  question: string;
  options: string[] | null | undefined;
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
}

export const GameMultipleChoiceQuestion: React.FC<GameMultipleChoiceQuestionProps> =
  ({ question, options, selectedOption, onOptionSelect }) => {
    const formattedOptions = (options ?? []).map(option => ({
      label: option,
      value: option,
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

// Styles
const styles = StyleSheet.create({
  stepContent: {
    alignItems: 'center',
    gap: 40,
    paddingHorizontal: 20,
  },
  starContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starButton: {
    padding: 4,
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
