import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import UvFeedbackHeader from '../../components/common/uvFeedbackHeader';
import UvButton from '../../components/common/uvButton';
import Colors from '../../theme/color';
import { RootStackParamList } from '../../types/navigationTypes';
import { PlatformMultipleChoiceQuestion, PlatformRatingQuestion, PlatformTextQuestion } from '../../components/feedback/platformFeedbackSteps';
import UvScreenWrapper from '../../components/common/uvScreenWrapper';
import RightArrow from '../../assets/svg/rightArrow.svg';
import { useGetPlatformFeedbackQuestionsQuery, PlatformFeedbackQuestion } from '../../services/feedback/platformFeedbackApi';
import UvTypography from '../../components/common/uvTypography';

type PlatformFeedbackScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PlatformFeedbackScreen'>;

const PlatformFeedbackScreen = () => {
  const navigation = useNavigation<PlatformFeedbackScreenNavigationProp>();

  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const {
    data: questions = [],
    isLoading,
    isError,
    refetch,
  } = useGetPlatformFeedbackQuestionsQuery();

  const orderedQuestions = useMemo<PlatformFeedbackQuestion[]>(() => {
    if (!questions) {
      return [];
    }

    return [...questions].sort((a, b) => a.order - b.order);
  }, [questions]);

  const totalSteps = orderedQuestions.length;
  const currentQuestion = orderedQuestions[currentStep - 1];

  useEffect(() => {
    if (!orderedQuestions.length) {
      return;
    }

    setAnswers(prevAnswers => {
      const nextAnswers: Record<number, string> = {};

      orderedQuestions.forEach(question => {
        if (prevAnswers[question.id] !== undefined) {
          nextAnswers[question.id] = prevAnswers[question.id];
        }
      });

      return nextAnswers;
    });

    setCurrentStep(prevStep => {
      const nextStep = Math.min(Math.max(prevStep, 1), orderedQuestions.length || 1);
      return nextStep || 1;
    });
  }, [orderedQuestions]);

  useEffect(() => {
    if (orderedQuestions.length === 0) {
      setAnswers({});
      setCurrentStep(1);
    }
  }, [orderedQuestions.length]);

  const handleNext = () => {
    if (!currentQuestion) {
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      console.log('Platform feedback submitted', answers);
      navigation.navigate('GameFeedbackThankYouScreen');
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const renderStepContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.stateContainer}>
          <UvTypography variant="p" color={Colors.base[50]} align="center">
            We couldn&apos;t load the platform feedback questions. Please try again.
          </UvTypography>
          <UvButton
            title="Retry"
            onPress={() => refetch()}
            style={styles.retryButton}
          />
        </View>
      );
    }

    if (!currentQuestion) {
      return (
        <View style={styles.stateContainer}>
          <UvTypography variant="p" color={Colors.base[50]} align="center">
            No platform feedback questions are available right now.
          </UvTypography>
        </View>
      );
    }

    const currentAnswer = answers[currentQuestion.id];

    switch (currentQuestion.question_type) {
      case 'rating':
        return (
          <PlatformRatingQuestion
            question={currentQuestion.question_text}
            rating={Number(currentAnswer ?? 0)}
            onRatingChange={(rating: number) =>
              setAnswers(prev => ({
                ...prev,
                [currentQuestion.id]: rating.toString(),
              }))
            }
          />
        );
      case 'multiple_choice':
        return (
          <PlatformMultipleChoiceQuestion
            question={currentQuestion.question_text}
            options={currentQuestion.options}
            selectedOption={currentAnswer ?? null}
            onOptionSelect={(option: string) =>
              setAnswers(prev => ({
                ...prev,
                [currentQuestion.id]: option,
              }))
            }
          />
        );
      case 'text':
      default:
        return (
          <PlatformTextQuestion
            question={currentQuestion.question_text}
            response={currentAnswer ?? ''}
            onResponseChange={(response: string) =>
              setAnswers(prev => ({
                ...prev,
                [currentQuestion.id]: response,
              }))
            }
          />
        );
    }
  };

  const isStepValid = () => {
    if (!currentQuestion) {
      return false;
    }

    const answer = answers[currentQuestion.id];

    switch (currentQuestion.question_type) {
      case 'rating':
        return !!answer && Number(answer) > 0;
      case 'multiple_choice':
        return !!answer;
      case 'text':
      default:
        return !!answer && answer.trim().length > 0;
    }
  };

  const isNextDisabled =
    isLoading ||
    isError ||
    totalSteps === 0 ||
    !isStepValid();

  return (
    <UvScreenWrapper >
      <View style={styles.screenContent}>
        <UvFeedbackHeader
          currentStep={currentStep}
          totalSteps={totalSteps || 0}
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
            disabled={isNextDisabled}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
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
  retryButton: {
    alignSelf: 'center',
  },
});

