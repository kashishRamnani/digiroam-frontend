import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showErrorToast } from "../../utils/toast";
import axiosInstance from "../../utils/axiosConfig";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (data = {}, { rejectWithValue }) => {
    try {
      data = {
        locationCode: data.locationCode ?? "",
        type: data.type ?? "",
        slug: data.slug ?? "",
        packageCode: data.packageCode ?? "",
        iccid: data.iccid ?? "",
      };

      // const body = { ...defaultBody, ...params };

      const response = await axiosInstance.post(
        "/user/getDataPackagesList", data
      );

      return response.data.data.packageList;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch products";
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    error: null,
    currentPage: 1,
    itemsPerPage: 10,
    isLoading: false,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch products";
        state.items = [];
        state.isLoading = false;
      });
  },
});

export const { setCurrentPage } = productsSlice.actions;
export default productsSlice.reducer;
