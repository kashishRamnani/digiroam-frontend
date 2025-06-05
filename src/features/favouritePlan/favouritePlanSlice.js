import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";
import { showSuccessToast } from "../../utils/toast";

// Fetch Favourite Plans Thunk
export const retrieveFavouritePlans = createAsyncThunk(
    "plans/retrieveFavouritePlans",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/favourite-plans");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const upsertFavouritePlan = createAsyncThunk(
    "plans/upsertFavouritePlan",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/favourite-plans", formData);
            showSuccessToast("Plan has been added to favourites");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message ?? "Something went wrong");
        }
    }
);

export const removeFavouritePlan = createAsyncThunk(
    "plans/removeFavouritePlan",
    async (packageCode, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete("/favourite-plans/" + packageCode);
            showSuccessToast("Plan has been removed from favourites");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message ?? "Something went wrong");
        }
    }
)

const favouritePlanSlice = createSlice({
    name: "favouritePlan",
    initialState: {
        favouritePlans: [],
        loading: false,
        error: null,
    },

    extraReducers: (builder) =>
        builder
            .addCase(retrieveFavouritePlans.pending, (state) => {
                state.loading = true;
            })
            .addCase(retrieveFavouritePlans.fulfilled, (state, action) => {
                state.loading = false;
                state.favouritePlans = action.payload.plans;
            })
            .addCase(retrieveFavouritePlans.rejected, (state) => {
                state.loading = false;
            })


            .addCase(upsertFavouritePlan.pending, (state, action) => {
                state.loading = true;
                
                state.favouritePlans = [...state.favouritePlans, { packageCode: action.meta.arg.packageCode }]
            })
            .addCase(upsertFavouritePlan.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(upsertFavouritePlan.rejected, (state, action) => {
                state.loading = false;
                state.favouritePlans = state.favouritePlans.filter((plan) => plan.packageCode !== action.meta.arg.packageCode)
            })


            .addCase(removeFavouritePlan.pending, (state, action) => {
                state.loading = true;
                state.favouritePlans = state.favouritePlans.filter((plan) => plan.packageCode !== action.meta.arg)
            })
            .addCase(removeFavouritePlan.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(removeFavouritePlan.rejected, (state, action) => {
                state.loading = false;
                state.favouritePlans = [...state.favouritePlans, { packageCode: action.meta.arg }]
            })
})


export default favouritePlanSlice.reducer;