import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const quizapi = createApi({
  reducerPath: 'quizapi',
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
    // POST method for creating a quiz
    createTrainingQuiz: builder.mutation({
      query: ({
        training_id,
        name,
        pass_criteria,
        quiz_time,
        quiz_type,
        total_marks,
        marks_breakdown,
        selected_questions,
      }) => ({
        url: 'lms_module/create_training_quiz',
        method: 'POST',
        body: {
          training_id,
          name,
          pass_criteria,
          quiz_time,
          quiz_type,
          total_marks,
          marks_breakdown,
          selected_questions,
        },
      }),
      transformResponse: (response) => response, // Handle raw response
    }),

    // GET method for retrieving quizzes
    getTrainingQuizzes: builder.query({
      query: () => ({
        url: 'lms_module/create_training_quiz',
        method: 'GET',
      }),
      transformResponse: (response) => response, // Handle raw response
    }),

    // PUT method for updating or deleting a quiz
    updateDeleteQuiz: builder.mutation({
      query: ({
        quiz_id,
        training_id,
        name,
        pass_criteria,
        quiz_time,
        quiz_type,
        total_marks,
        marks_breakdown,
        selected_questions,
      }) => ({
        url: `lms_module/update_delete_quiz/${quiz_id}`,
        method: 'PUT',
        body: {
          training_id,
          name,
          pass_criteria,
          quiz_time,
          quiz_type,
          total_marks,
          marks_breakdown,
          selected_questions,
        },
      }),
      transformResponse: (response) => response, // Handle raw response
    }),
  }),
});

export const {
  useCreateTrainingQuizMutation, // Hook for the create_training_quiz POST API
  useGetTrainingQuizzesQuery,    // Hook for the create_training_quiz GET API
  useUpdateDeleteQuizMutation,   // Hook for the update_delete_quiz PUT API
} = quizapi;
