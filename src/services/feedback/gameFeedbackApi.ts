import backendBaseApi from '../backendBaseApi';
import { endPoints } from '../endPoints';

export type GameFeedbackQuestion = {
  id: number;
  question_text: string;
  question_type: 'rating' | 'text' | 'multiple_choice';
  options: string[] | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type GameFeedbackAnswerPayload = {
  question_id: number;
  rating: number | null;
  text_answer: string | null;
  selected_option: string | null;
};

export type SubmitGameFeedbackRequest = {
  game_id: number;
  answers: GameFeedbackAnswerPayload[];
};

export type GameFeedbackUserResponse = {
  id: number;
  game?: number;
  game_id?: number;
  name?: string;
  [key: string]: unknown;
};

const gameFeedbackApi = backendBaseApi.injectEndpoints({
  endpoints: build => ({
    getGameFeedbackQuestions: build.query<GameFeedbackQuestion[], void>({
      query: () => ({
        url: endPoints.gameFeedbackQuestions,
        method: 'GET',
      }),
      transformResponse: (response: GameFeedbackQuestion[]) =>
        [...response].sort((a, b) => a.order - b.order),
    }),
    submitGameFeedback: build.mutation<void, SubmitGameFeedbackRequest>({
      query: ({ game_id, answers }) => ({
        url: endPoints.gameFeedbackSubmit,
        method: 'POST',
        body: {
          game_id,
          answers,
        },
      }),
    }),
    getUserGameFeedback: build.query<GameFeedbackUserResponse[], number>({
      query: gameId => ({
        url: `${endPoints.gameFeedbackUser}${gameId}/`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetGameFeedbackQuestionsQuery,
  useSubmitGameFeedbackMutation,
  useGetUserGameFeedbackQuery,
} = gameFeedbackApi;

export default gameFeedbackApi;

