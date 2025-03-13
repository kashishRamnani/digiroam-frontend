export { default as authSlice } from "./auth/authSlice";
export { default as preferencesSlice } from "./preferences/preferenceSlice";
export { default as uiSlice } from "./ui/uiSlice";
export { default as productSlice } from "./products/productSlice";
export { default as cartSlice } from "./carts/cartSlice";
export { default as userSlice } from "./user/userSlice";
export { default as countriesSlice } from "./countries/countriesSlice";
export { default as paymentSlice } from "./payment/paymentSlice";
export { default as dataPlanSlice } from "./dataplan/dataPlanSlice";
export {default as emailSlice} from "./email/emailSlice"
// Export actions
export { setTheme, setLanguage } from "./preferences/preferenceSlice";
export { setLoading, setError, clearError } from "./ui/uiSlice";
export { setCurrentPage } from "./products/productSlice";
export {
  fetchCartFromServer,
  addToCart,
  removeFromCart,
  updateQuantity,
  setCartOpen,
  setAddToCartOpen,
  setSelectedProduct,
  resetCart,
} from "./carts/cartSlice";
export { resetProfileState } from "./user/userSlice";
export { resetPaymentState, setPaymentStatus } from "./payment/paymentSlice";
