// src/api/documentApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "constants/config";

export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.BACKEND_API_URL,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      // No need to set Content-Type here; it will automatically be set to 'multipart/form-data' by the browser when uploading files
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createDocument: builder.mutation({
      query: (documentData) => ({
        url: "dms_module/CreateDocument",
        method: "POST",
        body: documentData,
      }),
      transformResponse: (response) => response.data,
    }),

    createDocumentType: builder.mutation({
      query: (documentTypeData) => ({
        url: "dms_module/create_get_document_type",
        method: "POST",
        body: documentTypeData,
      }),
      transformResponse: (response) => response.data,
    }),

    fetchDocumentTypes: builder.query({
      query: () => ({
        url: "dms_module/get_document_type",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),

    fetchDocuments: builder.query({
      query: () => "dms_module/view_document",
      transformResponse: (response) => response.data,
    }),

    // Modified createTemplate mutation to handle file uploads
    createTemplate: builder.mutation({
      query: (templateData) => {
        // Create a FormData object to handle file upload
        const formData = new FormData();
        formData.append("template_name", templateData.template_name);
        formData.append("template_doc", templateData.template_doc); // Assuming template_doc is the file object

        return {
          url: "dms_module/CreateTemplate",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response) => response.data,
    }),

    viewTemplate: builder.query({
      query: () => ({
        url: "dms_module/ViewTemplate",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useCreateDocumentMutation,
  useCreateDocumentTypeMutation,
  useFetchDocumentTypesQuery,
  useFetchDocumentsQuery,
  useCreateTemplateMutation, // Export the updated mutation hook
  useViewTemplateQuery,
} = documentApi;
