import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";
import { formatBytesDetailed } from "../../utils/helpers/formatBytesDetailed";
import { convertMillisecondsToDHMS } from "../../utils/helpers/convertMillisecondsToDHMS";

// Async Thunk to fetch eSIM data
export const fetchDataPlan = createAsyncThunk(
  "dataPlan/fetchData",
  async (iccid, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/esim/allocatedProfiles", {
        iccid,
        pager: { pageNum: 1, pageSize: 10 },
      });

      if (response.data?.success) {
        const esimData = response.data.data?.esimList?.[0] || null;
        if (!esimData) return rejectWithValue("No eSIM data found");

        // Time calculations
        let remainingTime = 0;
        let totalDays = esimData.totalDuration ?? 0;
        let usagePercentage = 100;

        if (esimData?.expiredTime) {
          const currentDate = new Date();
          const activateDate = esimData?.activateTime ? new Date(esimData.activateTime) : null;
          const totalPlanTimeMs = totalDays * 24 * 60 * 60 * 1000;

          if (activateDate) {
            const planExpiryDate = new Date(activateDate.getTime() + totalPlanTimeMs);
            remainingTime = Math.max(0, planExpiryDate - currentDate);
            usagePercentage = (remainingTime / totalPlanTimeMs) * 100;
          } else {
            remainingTime = esimData.totalDuration;
          }
        }

        const { days, hours, minutes } = convertMillisecondsToDHMS(remainingTime);

        // Data calculations
        let totalData = "0B",
          dataLeft = "0B",
          dataUsagePercentage = 100;

        if (esimData?.totalVolume) {
          const totalVolume = esimData.totalVolume;
          const usedVolume = esimData.orderUsage || 0;
          const remainingVolume = totalVolume - usedVolume;

          totalData = formatBytesDetailed(totalVolume);
          dataLeft = formatBytesDetailed(remainingVolume, !usedVolume > 0);
          dataUsagePercentage = (remainingVolume / totalVolume) * 100;
        }

        return {
          totalDays,
          daysLeft: days,
          hoursLeft: hours,
          minutesLeft: minutes,
          usagePercentage,
          totalData,
          dataLeft,
          dataUsagePercentage,
          esimDetails: esimData,
        };
      } else {
        return rejectWithValue("Failed to fetch data");
      }
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
    hoursLeft: 0,
    minutesLeft: 0,
    usagePercentage: 100,
    totalData: "0B",
    dataLeft: "0B",
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
        return { ...state, ...action.payload, loading: false };
      })
      .addCase(fetchDataPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dataPlanSlice.reducer;
