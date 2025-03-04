import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";
import { showErrorToast, showSuccessToast } from "../../utils/toast";


const handleError = (error) => {
  const message = error.response?.data?.message || "Something went wrong. Please try again.";
  showErrorToast(message);
  return message;
};


// Fetch Cart from Server
export const fetchCartFromServer = createAsyncThunk(
  "cart/fetchCartFromServer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`cart/getCartDetails`);  
      
      return response.data.cart.items;

    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Add Item to Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`cart/addToCart`, {
        productId: product.packageCode,
        productName: product.name,
        productPrice: product.price,
        productQuantity: quantity,
      });
      showSuccessToast(`${product.name} added to cart!`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Remove Item from Cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`cart/removeFromCart`, {
        productId,
      });
      if (response.data) {
        showSuccessToast("Product removed from cart!");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);



// clear Item from Cart
export const clearFromCart = createAsyncThunk(
  "cart/clearFromCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`cart/clearCart`);
      if (response.data) {
        showSuccessToast("cart clear succefully!");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    isCartOpen: false,
    isAddToCartOpen: false,
    selectedProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      } else {
        console.warn(`Product with ID ${productId} not found in the cart.`);
      }
    },
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },
    setAddToCartOpen: (state, action) => {
      state.isAddToCartOpen = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    resetCart: (state) => {
      state.items = [];
      state.isCartOpen = false;
      state.isAddToCartOpen = false;
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartFromServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartFromServer.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || []; 
      })
      .addCase(fetchCartFromServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(clearFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(clearFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  updateQuantity,
  setCartOpen,
  setAddToCartOpen,
  setSelectedProduct,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
