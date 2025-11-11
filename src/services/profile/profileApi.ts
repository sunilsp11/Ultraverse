import backendBaseApi from "../backendBaseApi";
import { endPoints } from "../endPoints";
import { setProfile, updateProfile } from "../../store/slices/profileSlice";

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
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useUploadProfilePictureMutation,
  useUpdateProfileDetailsMutation,
} = profileApi;

export default profileApi;

