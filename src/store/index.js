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
  settingsSlice,
  allocatedProfilesReducer,
  esimSlice,
  favouritePlanSlice,
 walletSlice
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
    settings: settingsSlice,
    allocatedProfiles: allocatedProfilesReducer,
    esims: esimSlice,
    favouritePlans: favouritePlanSlice,
    wallet:walletSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
