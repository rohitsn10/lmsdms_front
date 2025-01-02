import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const trainingMappingApi = createApi({
  reducerPath: 'trainingMappingApi',
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
    // PUT method for assigning training to job roles
    jobroleAssignTraining: builder.mutation({
      query: ({ training_id, job_role_ids }) => ({
        url: 'lms_module/jobrole_assign_training',
        method: 'PUT',
        body: {
          training_id,
          job_role_ids,
        },
      }),
      transformResponse: (response) => response, // Handle raw response
    }),
  }),
});

export const {
  useJobroleAssignTrainingMutation, // Hook for assigning training to job roles (PUT)
} = trainingMappingApi;
