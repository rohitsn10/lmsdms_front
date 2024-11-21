// src/apis/printApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const printApi = createApi({
  reducerPath: 'printApi',
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
    printDocument: builder.mutation({
      query: ({ sop_document_id, no_of_print, issue_type, reason_for_print }) => ({
        url: 'dms_module/print_request',
        method: 'POST',
        body: { sop_document_id, no_of_print, issue_type, reason_for_print },
      }),
      transformResponse: (response) => response, // Handle raw response
    }),
    getPrintRequests: builder.query({
      query: () => ({
        url: 'dms_module/get_print_request',
        method: 'GET',
      }),
      transformResponse: (response) => response.data, // Extract only the data part from the response
    }),
    // New print_approvals API integration
    printApprovals: builder.mutation({
      query: ({ print_request_id, no_of_request_by_admin, status }) => ({
        url: 'dms_module/print_approvals',
        method: 'POST',
        body: { print_request_id, no_of_request_by_admin, status },
      }),
      transformResponse: (response) => response, // Handle raw response
    }),
  }),
});

export const { 
  usePrintDocumentMutation, 
  useGetPrintRequestsQuery,
  usePrintApprovalsMutation // New hook for print_approvals
} = printApi;
