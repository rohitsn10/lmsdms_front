// src/apis/jobroleApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const jobroleApi = createApi({
  reducerPath: 'jobroleApi',
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
    // POST method for creating a job role
    createJobRole: builder.mutation({
      query: ({ job_role_name, job_role_description, plant , area , department }) => ({
        url: 'lms_module/create_get_job_role',
        method: 'POST',
        body: { job_role_name, job_role_description,plant , area , department },
      }),
      transformResponse: (response) => response, // Handle raw response
    }),

    // GET method for retrieving job role data
    getJobRole: builder.query({
      query: () => ({
        url: 'lms_module/create_get_job_role',
        method: 'GET',
      }),
      transformResponse: (response) => response, // Handle raw response
    }),

    // PUT method for updating a job role
    updateJobRole: builder.mutation({
      query: ({ job_role_id, job_role_name, job_role_description }) => ({
        url: `lms_module/update_delete_job_role/${job_role_id}`,
        method: 'PUT',
        body: { job_role_name, job_role_description },
      }),
      transformResponse: (response) => response, // Handle raw response
    }),
  }),
});

export const { 
  useCreateJobRoleMutation,   // Hook for creating a job role (POST)
  useGetJobRoleQuery,         // Hook for getting job roles (GET)
  useUpdateJobRoleMutation,   // Hook for updating job roles (PUT)
} = jobroleApi;
