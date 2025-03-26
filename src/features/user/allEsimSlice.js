import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../utils/axiosConfig";

export const fetchEsims = createAsyncThunk(
  "esims/fetchEsims",
  async (batchOrderNo, { rejectWithValue }) => {
    try {
       const response = await axiosInstance.get("/users/esims", {
        params: { orderNo: batchOrderNo },
      });
     return response.data.esims || [];
      
    } catch (error) {
     
      return rejectWithValue(error.response?.data || "Failed to fetch eSIMs");
    }
  }
);

const esimSlice = createSlice({
  name: "esims",
  initialState: { esims: [], isLoading: false, error: null },
  currentPage: 1,
  itemsPerPage: 10,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEsims.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEsims.fulfilled, (state, action) => {
        state.isLoading = false;
        state.esims = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchEsims.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});
export const {setcurrentPage  }= esimSlice.actions
export default esimSlice.reducer;
