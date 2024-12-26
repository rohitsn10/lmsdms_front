// src/apis/TrainingApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const trainingApi = createApi({
  reducerPath: 'trainingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.BACKEND_API_URL,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createTraining: builder.mutation({
        query: (formData) => {
          return {
            url: 'lms_module/create_training',
            method: 'POST',
            body: formData, // Directly pass the formData received from AddTraining
          };
        },
        transformResponse: (response) => response, // Handle raw response
      }),
      
    fetchTrainings: builder.query({
      query: () => ({
        url: 'lms_module/create_training',
        method: 'GET',
      }),
      transformResponse: (response) => response, // Handle raw response
    }),
    updateTraining: builder.mutation({
      query:  (formData) =>{

        return {
          url: `lms_module/update_training/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      transformResponse: (response) => response,
    }),
  }),
});

export const {
  useCreateTrainingMutation,
  useFetchTrainingsQuery,
  useUpdateTrainingMutation,
} = trainingApi;
