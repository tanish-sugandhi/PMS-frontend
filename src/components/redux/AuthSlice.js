// authSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token')?.token || null,
  isAuthenticated: JSON.parse(localStorage.getItem('token'))!=null || JSON.parse(localStorage.getItem('token'))!=undefined ? true:false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
    },
    logout(state) {
      console.log();
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
