import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const questionApi = createApi({
  reducerPath: 'questionApi',
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
    createTrainingQuestion: builder.mutation({
      query: (formData) => ({
        url: 'lms_module/create_training_questions',
        method: 'POST',
        body: formData, // Pass formData directly, including files
      }),
      transformResponse: (response) => response, // Handle raw response
    }),
    fetchTrainingQuestions: builder.query({
      query: () => ({
        url: 'lms_module/create_training_questions',
        method: 'GET',
      }),
      transformResponse: (response) => response, // Handle raw response
    }),
    updateTrainingQuestion: builder.mutation({
      query: ({ id, formData }) => ({
        url: `lms_module/update_training_questions/${id}`,
        method: 'PUT',
        body: formData, // Pass formData directly, including files
      }),
      transformResponse: (response) => response, // Handle raw response
    }),
    deleteTrainingQuestion:builder.mutation({
        query: ({ id, formData }) => ({
          url: `lms_module/update_training_questions/${id}`,
          method: 'DELETE',
          body: formData, // Pass formData directly, including files
        }),
        transformResponse: (response) => response, // Handle raw response
      }),
  }),
});

export const {
  useCreateTrainingQuestionMutation,
  useFetchTrainingQuestionsQuery,
  useUpdateTrainingQuestionMutation,
  useDeleteTrainingQuestionMutation,
} = questionApi;
