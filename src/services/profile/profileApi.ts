import backendBaseApi from "../backendBaseApi";
import { endPoints } from "../endPoints";
import { setProfile } from "../../store/slices/profileSlice";

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  profile_picture: string | null;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateProfilePayload = {
  first_name?: string | null;
  profile_picture?: string | null;
};

const profileApi = backendBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<UserProfile, void>({
      query: () => ({
        url: endPoints.profile,
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProfile(data));
        } catch (error) {
          dispatch(setProfile(null));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetProfileQuery } = profileApi;

export default profileApi;

