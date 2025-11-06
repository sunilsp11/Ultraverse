import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import UvFeedbackHeader from '../../components/common/uvFeedbackHeader';
import UvButton from '../../components/common/uvButton';
import Colors from '../../theme/color';
import { RootStackParamList } from '../../types/navigationTypes';
import { Step1, Step2, Step3, Step4, Step5 } from '../../components/feedback';
import UvScreenWrapper from '../../components/common/uvScreenWrapper';
import RightArrow from '../../assets/svg/rightArrow.svg';

type GameFeedbackScreenRouteProp = RouteProp<RootStackParamList, 'GameFeedbackScreen'>;
type GameFeedbackScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameFeedbackScreen'>;

const TOTAL_STEPS = 5;

const GameFeedbackScreen = () => {
  const navigation = useNavigation<GameFeedbackScreenNavigationProp>();
  const route = useRoute<GameFeedbackScreenRouteProp>();
  const { gameId } = route.params;

  const [currentStep, setCurrentStep] = useState(1);
  const [step1Rating, setStep1Rating] = useState(0);
  const [step2Response, setStep2Response] = useState('');
  const [step3Response, setStep3Response] = useState('');
  const [step4SelectedOption, setStep4SelectedOption] = useState<string | null>(null);
  const [step5Response, setStep5Response] = useState('');

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Feedback submitted');
      navigation.navigate('GameFeedbackThankYouScreen');
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            rating={step1Rating}
            onRatingChange={setStep1Rating}
          />
        );
      case 2:
        return (
          <Step2
            response={step2Response}
            onResponseChange={setStep2Response}
          />
        );
      case 3:
        return (
          <Step3
            response={step3Response}
            onResponseChange={setStep3Response}
          />
        );
      case 4:
        return (
          <Step4
            selectedOption={step4SelectedOption}
            onOptionSelect={setStep4SelectedOption}
          />
        );
      case 5:
        return (
          <Step5
            response={step5Response}
            onResponseChange={setStep5Response}
          />
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return step1Rating > 0;
      case 2:
        return step2Response.trim().length > 0;
      case 3:
        return step3Response.trim().length > 0;
      case 4:
        return step4SelectedOption !== null;
      case 5:
        return step5Response.trim().length > 0;
      default:
        return true;
    }
  };

  return (
    <UvScreenWrapper  >
    <View style={styles.container}>
      <UvFeedbackHeader
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onClose={handleClose}
      />

      <View style={styles.content}>
        {renderStepContent()}
      </View>

      <View style={styles.bottomButtonContainer}>
        <UvButton
          title="Next"
          onPress={handleNext}
          disabled={!isStepValid()}
          icon={<RightArrow width={16} height={16} color={Colors.base[950]} />}
          iconPosition="right"
          style={styles.nextButton}
        />
      </View>
    </View>
    </UvScreenWrapper>
  );
};

export default GameFeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'flex-end',
  },
  nextButton: {
    marginTop: 0,
    alignSelf: 'flex-end',
  },
});

