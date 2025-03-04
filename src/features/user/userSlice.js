import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const initialState = {
  loading: false,
  error: null,
  profileUpdated: false,
  profile: null,
  passwordChanged: false,
};

export const changeCurrentPassword = createAsyncThunk(
  "user/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/change-password", {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });
      showSuccessToast("Password changed successfully!");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password.";
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getMyProfile = createAsyncThunk(
  "user/getMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/getMyProfile");
      return response?.data?.data?.user;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch profile.";
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/user/updateProfile",
        profileData
      );
      showSuccessToast("Profile updated successfully!");
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Profile update failed.";
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.profileUpdated = false;
      state.passwordChanged = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.profileUpdated = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changeCurrentPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeCurrentPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordChanged = true;
      })
      .addCase(changeCurrentPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProfileState } = userSlice.actions;
export default userSlice.reducer;
