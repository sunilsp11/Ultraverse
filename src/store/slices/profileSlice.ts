import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../../services/profile/profileApi";

export type ProfileState = {
  profile: UserProfile | null;
};

const initialState: ProfileState = {
  profile: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserProfile | null>) {
      state.profile = action.payload;
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
    },
  },
});

export const { setProfile, updateProfile, clearProfile } = profileSlice.actions;

export default profileSlice.reducer;

