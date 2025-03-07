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
      query: ({ sop_document_id, no_of_print, issue_type, reason_for_print, printer_id }) => ({
        url: 'dms_module/print_request',
        method: 'POST',
        body: { sop_document_id, no_of_print, issue_type, reason_for_print, printer_id },
      }),
      transformResponse: (response) => response, // Handle raw response
    }),
    getPrintRequests: builder.query({
      query: (status_id) => ({
        url: `dms_module/get_print_request`,
        method: 'GET',
        params: {
          status_id, // Send the selected status as a query parameter
        },
      }),
       transformResponse: (response) => ({
    total: response.total, // Include total count
    data: response.data, // Extract data array
  }), // Extract only the data part from the response
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
     // New print_request_excel_report API integration
     printRequestExcelReport: builder.query({
      query: (status_id) => ({
        url: `dms_module/print_request_excel_report`,
        method: 'GET',
        params: { status_id }, // Send the status_id as a query parameter
      }),
      transformResponse: (response) => response, // Handle raw response
    }),
    printConvertPdf: builder.mutation({ 
      query: ({ sop_document_id, approval_numbers, document_status }) => ({ 
        url: `dms_module/print_convert_pdf/${sop_document_id}`,
        method: "PUT",
        body: { 
          approval_numbers, 
          document_status 
        },
      }),
      transformResponse: (response) => response,
    }),
    
  }),
});

export const { 
  usePrintDocumentMutation, 
  useGetPrintRequestsQuery,
  usePrintApprovalsMutation, // New hook for print_approvals
  usePrintRequestExcelReportQuery,
  usePrintConvertPdfMutation,
} = printApi;
