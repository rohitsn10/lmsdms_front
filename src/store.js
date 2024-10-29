// src/store.js

import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './api/auth/userApi'; // Adjust the path if needed

const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer, // Add userApi reducer
    // You can add more reducers here if you have them
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware), // Add userApi middleware
});

// Optional: If you want to enable the Redux DevTools Extension
if (process.env.NODE_ENV !== 'production') {
  const { enableMapSet } = require('immer');
  enableMapSet();
}

export default store; // Export the store for use in your app
