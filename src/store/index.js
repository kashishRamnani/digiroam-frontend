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
  dataPlanSlice,
  emailSlice,
  usersSlice,
  settingsSlice
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
    dataPlan: dataPlanSlice,
    email: emailSlice,
    users: usersSlice,
    settings: settingsSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
