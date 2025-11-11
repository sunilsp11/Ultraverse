import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../../services/profile/profileApi";

export type ProfileProvider = "credentials" | "google" | null;

export type ProfileState = {
  profile: UserProfile | null;
  provider: ProfileProvider;
};

const initialState: ProfileState = {
  profile: null,
  provider: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserProfile | null>) {
      state.profile = action.payload;
    },
    setAuthProvider(state, action: PayloadAction<ProfileProvider>) {
      state.provider = action.payload;
    },
    updateProfile(state, action: PayloadAction<Partial<UserProfile>>) {
      if (!state.profile) {
        return;
      }

      state.profile = {
        ...state.profile,
        ...action.payload,
      };
    },
    clearProfile(state) {
      state.profile = null;
      state.provider = null;
    },
  },
});

export const { setProfile, setAuthProvider, updateProfile, clearProfile } =
  profileSlice.actions;

export default profileSlice.reducer;

