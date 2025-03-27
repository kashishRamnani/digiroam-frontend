import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";

//All payment info
export const paymentInfo = createAsyncThunk(
  "paymentSave/getMyPaymentInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/paymentSave/getMyPaymentInfo");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Generate PayPal Order ID
export const generatePayPalOrderId = createAsyncThunk(
  "payment/generatePayPalOrderId",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/payment/paypal/generateOrderId",
        paymentData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Capture PayPal Order
export const capturePayPalOrder = createAsyncThunk(
  "payment/capturePayPalOrder",
  async ({ orderId, currency_code }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/payment/paypal/captureOrder",
        { orderId, currency_code }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create Stripe Payment Intent
export const createStripePaymentIntent = createAsyncThunk(
  "payment/createStripePaymentIntent",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/payment/stripe/stripePaymentIntent",
        paymentData
      );
      return response.data;
    } catch (error) {
      console.error("Stripe Payment Error:", error.response.data);
      return rejectWithValue(
        error.response?.data || "Failed to create Stripe Payment Intent"
      );
    }
  }
);

// Save Payment Data
export const savePaymentData = createAsyncThunk(
  "payment/savePaymentData",
  async (paymentDetails, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/paymentSave/store", paymentDetails);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to save payment data");
    }
  }
);

// **NEW API INTEGRATION**: Order eSim Profiles
export const orderEsimProfiles = createAsyncThunk(
  "payment/orderEsimProfiles",
  async ({ transactionId, amount, packageInfoList }, { rejectWithValue }) => {
    if (!transactionId || !amount || !packageInfoList?.length) {
      return rejectWithValue("Missing required parameters for eSim order");
    }

    try {
      const response = await axiosInstance.post("/eSim/orderProfiles", {
        transactionId,
        amount,
        packageInfoList,
      });
      return response.data;
    } catch (error) {
      console.error("eSim Order Error:", error);

      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to order eSim profiles"
      );
    }
  }
);


const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paypalOrderId: null,
    stripeClientSecret: null,
    loading: false,
    error: null,
    paymentStatus: null,
    paymentSaveStatus: null,
    esimOrderStatus: null,
    paymentData: [],
  },
  reducers: {
    resetPaymentState: (state) => {
      state.paypalOrderId = null;
      state.stripeClientSecret = null;
      state.loading = false;
      state.error = null;
      state.paymentStatus = null;
      state.paymentSaveStatus = null;
      state.esimOrderStatus = null;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generatePayPalOrderId.pending, (state) => {
        state.loading = true;
      })
      .addCase(generatePayPalOrderId.fulfilled, (state, action) => {
        state.loading = false;
        state.paypalOrderId = action.payload.orderId;
      })
      .addCase(generatePayPalOrderId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(capturePayPalOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(capturePayPalOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.paypalOrderId = null;
        state.paymentStatus = "success";
      })
      .addCase(capturePayPalOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStripePaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStripePaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.stripeClientSecret = action.payload.clientSecret;
      })
      .addCase(createStripePaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(savePaymentData.pending, (state) => {
        state.loading = true;
        state.paymentSaveStatus = null;
      })
      .addCase(savePaymentData.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentSaveStatus = "success";
      })
      .addCase(savePaymentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentSaveStatus = "failed";
      })
      .addCase(orderEsimProfiles.pending, (state) => {
        state.loading = true;
        state.esimOrderStatus = null;
      })
      .addCase(orderEsimProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.esimOrderStatus = "success";
      })
      .addCase(orderEsimProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.esimOrderStatus = "failed";
      })
      .addCase(paymentInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(paymentInfo.fulfilled, (state, action) => {

        state.loading = false;
        state.paymentData = action.payload.myPayments;
      })
      .addCase(paymentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetPaymentState, setPaymentStatus } = paymentSlice.actions;

export default paymentSlice.reducer;
