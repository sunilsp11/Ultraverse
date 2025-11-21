import backendBaseApi from "../backendBaseApi";
import { endPoints } from "../endPoints";
import {
  setAuthProvider,
  setProfile,
  updateProfile,
} from "../../store/slices/profileSlice";
import { RootState } from "../../store/store";

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

export type UploadProfilePictureResponse = {
  profile_picture_url: string | null;
  profile_picture: string | null;
};

export type StreakData = {
  streak: boolean[];
  current_streak: number;
  week_start: string;
  week_end: string;
};

export type RecordActivityResponse = {
  message: string;
  streak: StreakData;
};

export type UpdateLocationPayload = {
  latitude?: string | number;
  longitude?: string | number;
  address?: string;
  location_permission_enabled: boolean;
};

export type LocationData = {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
};

export type UpdateLocationResponse = UserProfile & {
  latitude: string | null;
  longitude: string | null;
  address: string | null;
  location_permission_enabled: boolean;
  streak: StreakData;
  location: LocationData | null;
};

const profileApi = backendBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<UserProfile, void>({
      query: () => ({
        url: endPoints.profile,
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProfile(data));
          dispatch(setAuthProvider("credentials"));
        } catch (error) {
          const state = getState() as RootState;
          if (state.profile.provider === "google") {
            return;
          }
          dispatch(setProfile(null));
          dispatch(setAuthProvider(null));
        }
      },
    }),
    uploadProfilePicture: build.mutation<UploadProfilePictureResponse, FormData>({
      query: (body) => ({
        url: endPoints.uploadProfilePicture,
        method: "POST",
        body,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          const withCacheBuster = (uri: string | null | undefined) => {
            if (!uri) {
              return uri ?? null;
            }

            const separator = uri.includes("?") ? "&" : "?";
            return `${uri}${separator}cb=${Date.now()}`;
          };

          const nextProfilePictureUrl = withCacheBuster(data.profile_picture_url);

          dispatch(
            profileApi.util.updateQueryData("getProfile", undefined, (draft) => {
              if (!draft) {
                return;
              }

              draft.profile_picture_url =
                nextProfilePictureUrl ?? draft.profile_picture_url;
              draft.profile_picture = data.profile_picture ?? draft.profile_picture;
            })
          );
          dispatch(
            updateProfile({
              profile_picture_url: nextProfilePictureUrl ?? undefined,
              profile_picture: data.profile_picture ?? undefined,
            })
          );
        } catch (error) {
          console.error("Error uploading profile picture:", error);
        }
      },
    }),
    updateProfileDetails: build.mutation<UserProfile, CreateProfilePayload>({
      query: (body) => ({
        url: endPoints.updateProfile,
        method: "PUT",
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            profileApi.util.updateQueryData("getProfile", undefined, (draft) => {
              if (!draft) {
                return;
              }

              Object.assign(draft, data);
            })
          );
          dispatch(setProfile(data));
          dispatch(updateProfile(data));
        } catch (error) {
          console.error("Error updating profile details:", error);
        }
      },
    }),
    recordActivity: build.mutation<RecordActivityResponse, void>({
      query: () => ({
        url: endPoints.recordActivity,
        method: "POST",
      }),
    }),
    updateLocation: build.mutation<UpdateLocationResponse, UpdateLocationPayload>({
      query: (body) => ({
        url: endPoints.updateLocation,
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useUploadProfilePictureMutation,
  useUpdateProfileDetailsMutation,
  useRecordActivityMutation,
  useUpdateLocationMutation,
} = profileApi;

export default profileApi;

