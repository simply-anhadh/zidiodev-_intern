import { createSlice } from '@reduxjs/toolkit';

// Auth state is now fully managed by Clerk.
// This slice is kept minimal to avoid breaking existing Redux imports.
const authSlice = createSlice({
  name: 'auth',
  initialState: {},
  reducers: {},
});

export default authSlice.reducer;

// Legacy exports kept so existing imports don't break during migration
export const logout = () => ({ type: 'auth/noop' });
export const clearError = () => ({ type: 'auth/noop' });
export const login = () => ({ type: 'auth/noop' });
export const register = () => ({ type: 'auth/noop' });