// src/apis/TrainingTypeApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const trainingTypeApi = createApi({
  reducerPath: 'trainingTypeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.BACKEND_API_URL,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createTrainingType: builder.mutation({
      query: ({ training_type_name }) => ({
        url: 'lms_module/create_training_type',
        method: 'POST',
        body: { training_type_name },
      }),
      transformResponse: (response) => response, 
    }),
    fetchTrainingTypes: builder.query({
        query: () => ({
          url: 'lms_module/create_training_type',
          method: 'GET',
        }),
        transformResponse: (response) => response, // Handle raw response
      }),
  }),
});

export const { 
  useCreateTrainingTypeMutation,
  useFetchTrainingTypesQuery,
} = trainingTypeApi;
