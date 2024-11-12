// src/apis/texteditorApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const texteditorApi = createApi({
  reducerPath: 'texteditorApi',
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
    // Fetch template by template ID
    getTemplateOnId: builder.query({
      query: (template_id) => ({
        url: `dms_module/GetTemplateOnId/${template_id}`, // Use dynamic template_id
        method: 'GET',
      }),
      transformResponse: (response) => response.data, // Extract data from response
    }),
  }),
});

export const { useGetTemplateOnIdQuery } = texteditorApi;
