import backendBaseApi from '../backendBaseApi';
import { endPoints } from '../endPoints';

export type PlatformFeedbackQuestion = {
  id: number;
  question_text: string;
  question_type: 'rating' | 'multiple_choice' | 'text' | string;
  options: string[] | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PlatformFeedbackAnswerPayload = {
  question_id: number;
  rating?: number | null;
  text_answer?: string | null;
  selected_option?: string | null;
};

export type SubmitPlatformFeedbackRequest = {
  answers: PlatformFeedbackAnswerPayload[];
};

const platformFeedbackApi = backendBaseApi.injectEndpoints({
  endpoints: build => ({
    getPlatformFeedbackQuestions: build.query<PlatformFeedbackQuestion[], void>({
      query: () => ({
        url: endPoints.platformFeedbackQuestions,
        method: 'GET',
      }),
      transformResponse: (response: PlatformFeedbackQuestion[]) =>
        Array.isArray(response)
          ? [...response].sort((a, b) => a.order - b.order)
          : [],
    }),
    submitPlatformFeedback: build.mutation<void, SubmitPlatformFeedbackRequest>({
      query: body => ({
        url: endPoints.platformFeedbackSubmit,
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPlatformFeedbackQuestionsQuery,
  useSubmitPlatformFeedbackMutation,
} = platformFeedbackApi;

export default platformFeedbackApi;

