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
  }),
  overrideExisting: true,
});

export const { useGetPlatformFeedbackQuestionsQuery } = platformFeedbackApi;

export default platformFeedbackApi;

