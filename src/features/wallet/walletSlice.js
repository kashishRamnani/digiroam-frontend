import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";


export const walletBalance = createAsyncThunk(
  "wallet/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/wallet/balance");
      console.log("WALLET BALANCE RESPONSE:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);


export const stripeAddFunds = createAsyncThunk(
  "wallet/stripeAddFunds",
  async ({ amount, currency }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/wallet/stripe/add-funds", {
        amount,
        currency,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);


export const addFunds = createAsyncThunk(
  "wallet/addFunds",
  async ({ transactionId, amount, currency }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/wallet/add-funds", {
        transactionId,
        amount,
        currency,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    balance: null,
    currency: null,
    stripeClientSecret: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.stripeClientSecret = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(walletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(walletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.currency = action.payload.currency;
      })
      .addCase(walletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(stripeAddFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(stripeAddFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.stripeClientSecret = action.payload.clientSecret;
      })
      .addCase(stripeAddFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFunds.fulfilled, (state,action) => {
        state.balance = action.payload.balance;
        state.loading = false;
         state.stripeClientSecret = null
       
      })
      .addCase(addFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPaymentState } = walletSlice.actions;

export default walletSlice.reducer;
