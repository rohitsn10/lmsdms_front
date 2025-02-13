// src/apis/classtestApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "constants/config";

export const classtestApi = createApi({
  reducerPath: "classtestApi",
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
    classroomQuestionsPost: builder.mutation({
      query: (dataForm) => ({
        url: "lms_module/classroom_questions",
        method: "POST",
        body: dataForm,
      }),
      transformResponse: (response) => response,
    }),
    classroomQuestionsGet: builder.query({
      query: (classroom_id) => ({
        url: `lms_module/classroom_id_wise_question/${classroom_id}`,
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),
    classroomQuizPost: builder.mutation({
      query: (quizData) => ({
        url: "lms_module/classroom_quiz",
        method: "POST",
        body: quizData,
      }),
      transformResponse: (response) => response,
    }),
    classroomQuizGet: builder.query({
      query: (classroom_id) => ({
        url: `lms_module/list_classroom_quiz/${classroom_id}`,
        method: "GET",
      }),
      transformResponse: (response) => response,
    }),
  }),
});

export const {
  useClassroomQuestionsPostMutation,
  useClassroomQuestionsGetQuery,
  useClassroomQuizPostMutation,
  useClassroomQuizGetQuery,
} = classtestApi;
