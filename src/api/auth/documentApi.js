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
  tagTypes: ['Documents', 'DocumentTypes'], // Define tags for documents and document types
  endpoints: (builder) => ({
    createDocument: builder.mutation({
      query: (documentData) => ({
        url: "dms_module/create_document",
        method: "POST",
        body: documentData,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['Documents'], // Invalidate document data to trigger refetch
    }),

    createDocumentType: builder.mutation({
      query: (documentTypeData) => ({
        url: "dms_module/create_get_document_type",
        method: "POST",
        body: documentTypeData,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['DocumentTypes'], // Invalidate document type data to trigger refetch
    }),

    fetchDocumentTypes: builder.query({
      query: () => ({
        url: "dms_module/get_document_type",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ['DocumentTypes'], // Tag document types data for cache management
    }),

    fetchDocuments: builder.query({
      query: () => "dms_module/view_document",
      transformResponse: (response) => response.data,
      providesTags: ['Documents'], // Tag documents data for cache management
    }),

    createTemplate: builder.mutation({
      query: (templateData) => ({
        url: "dms_module/CreateTemplate",
        method: "POST",
        body: templateData,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['Documents'], // Invalidate document data to trigger refetch
    }),

    viewTemplate: builder.query({
      query: () => ({
        url: "dms_module/ViewTemplate",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),

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
      invalidatesTags: ['Documents'], // Invalidate document data to trigger refetch
    }),

    updateTemplate: builder.mutation({
      query: ({ temp_id, template_name, template_doc }) => {
        const formData = new FormData();
        formData.append("template_name", template_name);
        if (template_doc) {
          formData.append("template_doc", template_doc);
        }

        return {
          url: `dms_module/UpdateTemplate/${temp_id}`,
          method: "PUT",
          body: formData,
        };
      },
      transformResponse: (response) => response.data,
      invalidatesTags: ['Documents'], // Invalidate document data to trigger refetch
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
  useUpdateTemplateMutation,
} = documentApi;
