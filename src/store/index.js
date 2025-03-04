import { configureStore } from "@reduxjs/toolkit";
import {
  authSlice,
  cartSlice,
  countriesSlice,
  preferencesSlice,
  productSlice,
  uiSlice,
  userSlice,
  paymentSlice,
} from "../features";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    preferences: preferencesSlice,
    ui: uiSlice,
    cart: cartSlice,
    plans: productSlice,
    userProfile: userSlice,
    countries: countriesSlice,
    payment: paymentSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
