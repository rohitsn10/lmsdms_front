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
    getTemplate: builder.query({
      query: (document_id) => ({
        url: `dms_module/GetTemplate/${document_id}`,
        method: 'GET',
      }),
      transformResponse: (response) => response.data,
    }),
    createDocument: builder.mutation({
      query: ({ document_id, document_data }) => ({
        url: `dms_module/create_document_details`,
        method: 'POST',
        body: { document_id, document_data },
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetTemplateQuery, useCreateDocumentMutation } = texteditorApi;
