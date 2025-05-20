import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";


export const walletBalance = createAsyncThunk(
  "wallet/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/wallet/balance");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);


export const stripePayment = createAsyncThunk(
  "wallet/stripePayment",
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


export const paypalGenerateOrder = createAsyncThunk("wallet/paypalGenerateOrder",
  async ({ amount, currency }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/wallet/paypal/generate-order/add-funds", {
        amount, currency
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)


export const paypalCaptureOrder = createAsyncThunk("wallet/paypal/CaptureOrder",
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/wallet/paypal/capture-order/add-funds", {
        orderId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

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

export const transactions = createAsyncThunk(
  "wallet/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/wallet/transactions");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    balance: "0.00",
    paypalOrder: null,
    currency: "USD",
    stripeClientSecret: null,
    transactions: [],
    loading: false,
    error: null,

  },
  reducers: {
    resetPaymentState: (state) => {
      state.stripeClientSecret = null;
      state.paypalOrder = null;
      state.balance = null;
      state.loading = false;
      state.error = null;
      state.paymentStatus = null
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
        // state.currency = action.payload.currency?;
      })
      .addCase(walletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(stripePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(stripePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.stripeClientSecret = action.payload.clientSecret;
      })
      .addCase(stripePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(paypalGenerateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(paypalGenerateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.paypalOrder = action.payload.orderId;


      })
      .addCase(paypalGenerateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(paypalCaptureOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(paypalCaptureOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.paypalOrder = null;


      })
      .addCase(paypalCaptureOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFunds.fulfilled, (state, action) => {
        state.balance = action.payload.balance;
        state.loading = false;
        state.stripeClientSecret = null

      })
      .addCase(addFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(transactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;

        console.log("Transaction successful:", action.payload);
      })
      .addCase(transactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export const { resetPaymentState } = walletSlice.actions;

export default walletSlice.reducer;
