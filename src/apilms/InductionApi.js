// src/apis/plantApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const inductionApi = createApi({
  reducerPath: 'inductionApi',
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
    createGetInduction: builder.mutation({
      query: (inductiondata) => ({
        url: 'lms_module/create_induction',
        method: 'POST',
        body: inductiondata,
      }),
      transformResponse: (response) => response,
    }),
    
    getInduction: builder.query({
      query: () => ({
        url: 'lms_module/create_induction',
        method: 'GET',
      }),
      transformResponse: (response) => response, // Handle raw response
    }),
    updateDeleteInduction: builder.mutation({
        query: ({ induction_id, induction_name }) => ({
          url: `lms_module/update_induction/${induction_id}`,
          method: 'PUT',
          body: { induction_name },
        }),
        transformResponse: (response) => response, // Handle raw response
      }),

      //for induction designation 
      createInductionDesignation: builder.mutation({
        query: ({ induction_designation_name, designation_code, induction }) => ({
          url: "lms_module/create_induction_designation",
          method: "POST",
          body: { induction_designation_name, designation_code, induction },
        }),
        transformResponse: (response) => response,
      }),
  }),
});

export const { 
  useCreateGetInductionMutation, // Hook for the create_get_plant POST API
  useGetInductionQuery, // Hook for the create_get_plant GET API
  useUpdateDeleteInductionMutation,
  useCreateInductionDesignationMutation, 
} = inductionApi;
