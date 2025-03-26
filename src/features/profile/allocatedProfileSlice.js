import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";

export const allocatedProfiles = createAsyncThunk(
  "allocatedProfiles/fetch",
  async ({ orderNo }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/esim/allocatedProfiles", {
        orderNo,
        pager: { pageNum: 1, pageSize: 10 },
      });

      if (response.data?.success) {
        return response.data.data.esimList; 
      } else {
        return rejectWithValue("No eSIM profiles found.");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "API error occurred.");
    }
  }
);

const allocatedProfileSlice = createSlice({
  name: "allocatedProfiles",
  initialState: {
    esimList: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(allocatedProfiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(allocatedProfiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.esimList = action.payload; 
      })
      .addCase(allocatedProfiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default allocatedProfileSlice.reducer;
