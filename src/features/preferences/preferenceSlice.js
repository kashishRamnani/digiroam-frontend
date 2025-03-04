import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  language: 'en',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      console.log('Language changed to:', action.payload);
      state.language = action.payload;
    },
  },
});

export const { setTheme, setLanguage } = preferencesSlice.actions;
export default preferencesSlice.reducer;

