import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import UvFeedbackHeader from '../../components/common/uvFeedbackHeader';
import UvButton from '../../components/common/uvButton';
import Colors from '../../theme/color';
import { RootStackParamList } from '../../types/navigationTypes';
import { PlatformStep1, PlatformStep2, PlatformStep3, PlatformStep4, PlatformStep5 } from '../../components/feedback/platformFeedbackSteps';
import UvScreenWrapper from '../../components/common/uvScreenWrapper';
import RightArrow from '../../assets/svg/rightArrow.svg';

type PlatformFeedbackScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PlatformFeedbackScreen'>;

const TOTAL_STEPS = 5;

const PlatformFeedbackScreen = () => {
  const navigation = useNavigation<PlatformFeedbackScreenNavigationProp>();

  const [currentStep, setCurrentStep] = useState(1);
  const [step1Rating, setStep1Rating] = useState(0);
  const [step2SelectedOption, setStep2SelectedOption] = useState<string | null>(null);
  const [step3Response, setStep3Response] = useState('');
  const [step4SelectedOption, setStep4SelectedOption] = useState<string | null>(null);
  const [step5Rating, setStep5Rating] = useState(0);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      console.log('Platform feedback submitted');
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
          <PlatformStep1
            rating={step1Rating}
            onRatingChange={setStep1Rating}
          />
        );
      case 2:
        return (
          <PlatformStep2
            selectedOption={step2SelectedOption}
            onOptionSelect={setStep2SelectedOption}
          />
        );
      case 3:
        return (
          <PlatformStep3
            response={step3Response}
            onResponseChange={setStep3Response}
          />
        );
      case 4:
        return (
          <PlatformStep4
            selectedOption={step4SelectedOption}
            onOptionSelect={setStep4SelectedOption}
          />
        );
      case 5:
        return (
          <PlatformStep5
            rating={step5Rating}
            onRatingChange={setStep5Rating}
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
        return step2SelectedOption !== null;
      case 3:
        return step3Response.trim().length > 0;
      case 4:
        return step4SelectedOption !== null;
      case 5:
        return step5Rating > 0;
      default:
        return true;
    }
  };

  return (
    <UvScreenWrapper >
      <View style={styles.screenContent}>
        <UvFeedbackHeader
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onClose={handleClose}
          title="PLATFORM FEEDBACK"
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

export default PlatformFeedbackScreen;

const styles = StyleSheet.create({
  screenContent: {
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

