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
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createDocument: builder.mutation({
      query: (documentData) => ({
        url: "dms_module/create_document",
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
        return {
          url: "dms_module/CreateTemplate",
          method: "POST",
          body: templateData,
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

    // New editTemplate mutation to edit a template
    editTemplate: builder.mutation({
      query: ({ templateId, templateData }) => {
        const formData = new FormData();
        formData.append("template_name", templateData.template_name);
        if (templateData.template_doc) {
          formData.append("template_doc", templateData.template_doc);
        }

        return {
          url: `dms_module/EditTemplate/${templateId}`,
          method: "PUT",
          body: formData,
        };
      },
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useCreateDocumentMutation,
  useCreateDocumentTypeMutation,
  useFetchDocumentTypesQuery,
  useFetchDocumentsQuery,
  useCreateTemplateMutation,
  useViewTemplateQuery,
  useEditTemplateMutation, 
} = documentApi;
