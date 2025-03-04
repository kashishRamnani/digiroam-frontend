import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const initialState = {
  user: localStorage.getItem("user") || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  otpRequested: false,
  otpVerified: false,
  otpRequired: false,
  emailForOTP: null,
  forgotPasswordStep: null,
};

export const requestOTP = createAsyncThunk(
  "auth/requestOTP",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/otp-verification/againSendOtp",
        {
          email: email,
        }
      );
      showSuccessToast("OTP sent successfully!");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP.";
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/verifyOtp", {
        email: email,
        otp,
      });
      const { user, accessToken } = response.data.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      showSuccessToast("OTP verified successfully!");
      return { user, token: accessToken };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "OTP verification failed.";
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/createUserAndSendOtp", {
        name,
        email,
        password,
      });
      showSuccessToast(response?.data?.message);
      const { email: responseEmail } = response?.data?.data || {};
      return { responseEmail };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed.";
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });
      const { user, accessToken } = response.data.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      showSuccessToast("Login successful!");
      return { user, token: accessToken };
    } catch (error) {
      if (error?.response?.status === 403) {
        const { email, verified } = error.response?.data?.data || {};
        if (!verified) {
          const errorMessage = error.response?.data?.message || "Login failed.";
          showErrorToast(errorMessage);
          return rejectWithValue({
            navigateTo: "verify-otp",
            email,
            errorMessage,
          });
        }
      }
      const errorMessage = error.response?.data?.message || "Login failed.";
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const signoutUser = createAsyncThunk("auth/signoutUser", async () => {
  try {
    // const response = await axiosInstance.post("/user/logout");
    // if (response?.status === 200 && response?.data?.success == true) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showSuccessToast("Logout successful!");
    // }
    return null;
  } catch (error) {
    showErrorToast("Logout failed.");
    throw error;
  }
});

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found.");
      }
      const response = await axiosInstance.post("/user/verify-token");
      const { user } = response?.data?.data;
      return { user };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Token verification failed.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/forgot-password", {
        email,
      });
      showSuccessToast("Password reset OTP sent successfully!");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send password reset OTP.";
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyPasswordResetOTP = createAsyncThunk(
  "auth/verifyPasswordResetOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/user/verifyForgotpasswordOtpVerification",
        { email, otp }
      );
      showSuccessToast("Password reset successfully and sent to your email!");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "OTP verification failed.";
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetOTPState: (state) => {
      state.otpRequested = false;
      state.otpVerified = false;
      state.otpRequired = false;
    },
    setUserAndToken: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOTP.fulfilled, (state) => {
        state.loading = false;
        state.otpRequested = true;
      })
      .addCase(requestOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
        state.otpRequired = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.otpRequested = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.emailForOTP = action.payload?.responseEmail;
        state.otpRequested = true;
        state.otpVerified = false;
        state.otpRequired = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.otpRequested = false;
        state.otpVerified = false;
        state.otpRequired = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errorMessage || "An error occurred";
        if (action.payload?.navigateTo === "verify-otp") {
          state.otpRequired = true;
        }
        state.emailForOTP = action.payload?.email;
      })

      .addCase(signoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.otpRequested = false;
        state.otpVerified = false;
        state.otpRequired = false;
      })
      .addCase(signoutUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = localStorage.getItem("token");
      })
      .addCase(verifyToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.loading = false;
        state.forgotPasswordStep = "verify";
        state.emailForOTP = action.meta.arg;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyPasswordResetOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPasswordResetOTP.fulfilled, (state) => {
        state.loading = false;
        state.forgotPasswordStep = null;
        state.emailForOTP = null;
      })
      .addCase(verifyPasswordResetOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOTPState, setUserAndToken } = authSlice.actions;
export default authSlice.reducer;
