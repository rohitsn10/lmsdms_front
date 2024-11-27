// src/apis/texteditorApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "constants/config";

export const texteditorApi = createApi({
  reducerPath: "texteditorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.BACKEND_API_URL,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTemplate: builder.query({
      query: (document_id) => ({
        url: `dms_module/GetTemplate/${document_id}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),
    createDocument: builder.mutation({
      query: ({ document_id, document_data }) => ({
        url: `dms_module/create_document_details`,
        method: "POST",
        body: { document_id, document_data },
      }),
      transformResponse: (response) => response.data,
    }),
    draftDocument: builder.mutation({
      query: ({ document_id, status_id }) => ({
        url: `dms_module/draft_document`,
        method: "PUT",
        body: { document_id, status_id },
      }),
      transformResponse: (response) => response,
    }),
    documentApproveStatus: builder.mutation({
      query: ({ document_id, documentdetails_id, status }) => ({
        url: `dms_module/document_approve_status`,
        method: "POST",
        body: { document_id, documentdetails_id, status },
      }),
      transformResponse: (response) => response,
    }),
    documentReviewStatus: builder.mutation({
      query: ({ document_id, status }) => ({
        url: `dms_module/document_review_status`,
        method: "POST",
        body: { document_id, status },
      }),
      transformResponse: (response) => response,
    }),
    documentApproverStatus: builder.mutation({
      query: ({ document_id, status }) => ({
        url: `dms_module/document_approver_status`,
        method: "POST",
        body: { document_id, status },
      }),
      transformResponse: (response) => response,
    }),
    documentDocadminStatus: builder.mutation({
      query: ({ document_id, status }) => ({
        url: `dms_module/document_docadmin_status`,
        method: "POST",
        body: { document_id, status },
      }),
      transformResponse: (response) => response,
    }),
  }),
});

export const {
  useGetTemplateQuery,
  useCreateDocumentMutation,
  useDraftDocumentMutation,
  useDocumentApproveStatusMutation,
  useDocumentReviewStatusMutation,
  useDocumentApproverStatusMutation,
  useDocumentDocadminStatusMutation
} = texteditorApi;
