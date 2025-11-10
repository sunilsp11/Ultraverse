import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import UvFeedbackHeader from '../../components/common/uvFeedbackHeader';
import UvButton from '../../components/common/uvButton';
import Colors from '../../theme/color';
import { RootStackParamList } from '../../types/navigationTypes';
import {
  GameMultipleChoiceQuestion,
  GameRatingQuestion,
  GameTextQuestion,
} from '../../components/feedback';
import UvScreenWrapper from '../../components/common/uvScreenWrapper';
import RightArrow from '../../assets/svg/rightArrow.svg';
import UvTypography from '../../components/common/uvTypography';
import {
  useGetGameFeedbackQuestionsQuery,
  useSubmitGameFeedbackMutation,
  GameFeedbackQuestion,
  GameFeedbackAnswerPayload,
} from '../../services/feedback/gameFeedbackApi';

type GameFeedbackScreenRouteProp = RouteProp<RootStackParamList, 'GameFeedbackScreen'>;
type GameFeedbackScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameFeedbackScreen'>;

const GameFeedbackScreen = () => {
  const navigation = useNavigation<GameFeedbackScreenNavigationProp>();
  const route = useRoute<GameFeedbackScreenRouteProp>();
  const { gameId } = route.params;

  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    data: questions = [],
    isLoading,
    isError,
    refetch,
  } = useGetGameFeedbackQuestionsQuery();

  const [submitGameFeedback, { isLoading: isSubmitting }] = useSubmitGameFeedbackMutation();

  const orderedQuestions = useMemo<GameFeedbackQuestion[]>(() => {
    if (!questions) {
      return [];
    }

    return [...questions].sort((a, b) => a.order - b.order);
  }, [questions]);

  const normalizedGameId = useMemo<number | null>(() => {
    const parsedId = Number(gameId);
    return Number.isFinite(parsedId) ? parsedId : null;
  }, [gameId]);

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
      setSubmissionError(null);
    }
  }, [orderedQuestions.length]);

  const buildSubmissionPayload = (): GameFeedbackAnswerPayload[] => {
    return orderedQuestions.map(question => {
      const answer = answers[question.id];

      switch (question.question_type) {
        case 'rating': {
          const ratingValue = answer ? Number(answer) : null;
          return {
            question_id: question.id,
            rating: Number.isFinite(ratingValue) ? ratingValue : null,
            text_answer: null,
            selected_option: null,
          };
        }
        case 'multiple_choice':
          return {
            question_id: question.id,
            rating: null,
            text_answer: null,
            selected_option: answer ?? null,
          };
        case 'text':
        default:
          return {
            question_id: question.id,
            rating: null,
            text_answer: answer ?? '',
            selected_option: null,
          };
      }
    });
  };

  const handleNext = async () => {
    if (!currentQuestion) {
      return;
    }

    setSubmissionError(null);

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    if (normalizedGameId === null) {
      setSubmissionError('Unable to identify the game for this feedback. Please return and try again.');
      return;
    }

    try {
      const payload = buildSubmissionPayload();
      await submitGameFeedback({
        game_id: normalizedGameId,
        answers: payload,
      }).unwrap();
      navigation.navigate('GameFeedbackThankYouScreen');
    } catch (error) {
      console.error('Error submitting game feedback', error);
      setSubmissionError('We ran into an issue while submitting your feedback. Please try again.');
    }
  };

  const handleNextPress = () => {
    void handleNext();
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
            We couldn&apos;t load the game feedback questions. Please try again.
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
            No game feedback questions are available right now.
          </UvTypography>
        </View>
      );
    }

    const currentAnswer = answers[currentQuestion.id];

    switch (currentQuestion.question_type) {
      case 'rating':
        return (
          <GameRatingQuestion
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
          <GameMultipleChoiceQuestion
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
          <GameTextQuestion
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
    !isStepValid() ||
    isSubmitting;

  return (
    <UvScreenWrapper  >
    <View style={styles.container}>
      <UvFeedbackHeader
        currentStep={currentStep}
        totalSteps={totalSteps || 0}
        onClose={handleClose}
        title="GAME FEEDBACK"
      />

      <View style={styles.content}>
        {renderStepContent()}
      </View>

      {submissionError ? (
        <View style={styles.errorContainer}>
          <UvTypography variant="bodyXs" color={Colors.danger[400]} align="center">
            {submissionError}
          </UvTypography>
        </View>
      ) : null}

      <View style={styles.bottomButtonContainer}>
        <UvButton
          title={currentStep === totalSteps ? 'Submit' : 'Next'}
          onPress={handleNextPress}
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

export default GameFeedbackScreen;

const styles = StyleSheet.create({
  container: {
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
  errorContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  nextButton: {
    marginTop: 0,
    alignSelf: 'flex-end',
  },
  retryButton: {
    alignSelf: 'center',
  },
});

