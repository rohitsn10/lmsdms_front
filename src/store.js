import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './api/auth/userApi'; 
import { documentApi } from './api/auth/documentApi'; 

const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer, 
    [documentApi.reducerPath]: documentApi.reducer, 
   
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, documentApi.middleware), 
});


if (process.env.NODE_ENV !== 'production') {
  const { enableMapSet } = require('immer');
  enableMapSet();
}

export default store;
