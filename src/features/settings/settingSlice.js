import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

const initialState = {
    pricePercentage: 0,
    serviceLinks: [],
    contactList: [],
    minTopupRange :5,
    loading: false,
    error: null,
};

const handleError = (error) => {
    showErrorToast(error?.response?.data?.message ?? "Something went wrong");
    return error?.response?.data;
}

// Async Thunks
export const retrieveSettings = createAsyncThunk(
    "settings/retrieve",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/settings`);
            return response.data.settings;
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const updateSettings = createAsyncThunk(
    "settings/update",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/settings`, formData);
            showSuccessToast("Settings updated successfully");
            return response.data.settings;
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);


// Slice
const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(retrieveSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(retrieveSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.pricePercentage = action.payload.pricePercentage;
                state.serviceLinks = action.payload.serviceLinks;
                state.contactList = action.payload.contactList;
                state.minTopupRange = action.payload.minTopupRange ?? 5;
            })
            .addCase(retrieveSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message ?? "Failed to retrieve settings";
            })
            .addCase(updateSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.pricePercentage = action.payload.pricePercentage;
                state.serviceLinks = action.payload.serviceLinks;
                state.contactList = action.payload.contactList;
                state.minTopupRange = action.payload.minTopupRange ?? 5;
            })
            .addCase(updateSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message ?? "Failed to update settings";
            });
    },
});

export default settingsSlice.reducer;
