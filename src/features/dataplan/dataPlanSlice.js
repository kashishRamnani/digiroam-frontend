// src/redux/slices/dataPlanSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";

export const fetchDataPlan = createAsyncThunk(
  "dataPlan/fetchDataPlan",
  async (iccid, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/esim/allocatedProfiles", {
        iccid,
        pager: { pageNum: 1, pageSize: 10 },
      });
      if (response.data?.success) {
        return response.data.data?.esimList?.[0] || null;
      }
      return rejectWithValue("Failed to fetch data");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const dataPlanSlice = createSlice({
  name: "dataPlan",
  initialState: {
    totalDays: 0,
    daysLeft: 0,
    usagePercentage: 100,
    totalData: 0,
    dataLeft: 0,
    dataUsagePercentage: 100,
    esimDetails: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataPlan.fulfilled, (state, action) => {
        state.loading = false;
        const esimData = action.payload;
        if (!esimData) return;

        // Time Calculation
        const currentDate = new Date();
        const expiredDate = new Date(esimData.expiredTime);
        const activateDate = esimData?.activateTime ? new Date(esimData.activateTime) : null;
        let totalDays = esimData.totalDuration ?? 0;
        let remainingDays = 0;

        if (activateDate) {
          remainingDays = Math.max(0, totalDays - Math.ceil((currentDate - activateDate) / (1000 * 60 * 60 * 24)));
        } else if (currentDate < expiredDate) {
          remainingDays = Math.max(0, totalDays);
        }

        state.totalDays = totalDays;
        state.daysLeft = remainingDays;
        state.usagePercentage = remainingDays > 0 ? (remainingDays / (totalDays || 1)) * 100 : 0;

        // Data Calculation
        const totalVolume = esimData.totalVolume || 0;
        const usedVolume = esimData.orderUsage || 0;
        const remainingVolume = totalVolume - usedVolume;

        state.totalData = totalVolume / (1024 * 1024 * 1024); 
        state.dataLeft = remainingVolume / (1024 * 1024 * 1024);
        state.dataUsagePercentage = (remainingVolume / (totalVolume || 1)) * 100;
        state.esimDetails = esimData;
      })
      .addCase(fetchDataPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dataPlanSlice.reducer;
