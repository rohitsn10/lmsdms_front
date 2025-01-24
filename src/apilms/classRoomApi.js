import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

// Define the classRoomApi
export const classRoomApi = createApi({
  reducerPath: 'classRoomApi',
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
    createClassroom: builder.mutation({
        query: (formData) => ({
          url: 'lms_module/create_classroom',
          method: 'POST',
          body: formData, // Send the FormData object directly
        }),
        transformResponse: (response) => response,
      }),
      
    // GET method for retrieving classroom data
    getClassrooms: builder.query({
      query: () => ({
        url: 'lms_module/create_classroom', 
        method: 'GET',
      }),
      transformResponse: (response) => response, 
    }),

    // PUT method for updating a classroom
    updateClassroom: builder.mutation({
      query: ({ id, classroom_name, is_assesment, description, upload_doc, status }) => ({
        url: `lms_module/update_classroom/${id}`,
        method: 'PUT',
        body: { classroom_name, is_assesment, description, upload_doc, status },
      }),
      transformResponse: (response) => response, 
    }),
    createSession: builder.mutation({
      query: (sessionData) => ({
        url: 'lms_module/create_session',
        method: 'POST',
        body: sessionData,
      }),
      transformResponse: (response) => response,
    }),
    getSessions: builder.query({
      query: (classroomId) => ({
        url: `lms_module/create_session?classroom_id=${classroomId}`,
        method: 'GET',
      }),
      transformResponse: (response) => response,
    }),
    markSessionCompleted: builder.mutation({
      query: (sessionId) => ({
        url: `lms_module/session_completed/${sessionId}`,
        method: 'POST', // Typically, this would be a POST request to mark something as completed
      }),
      transformResponse: (response) => response,
    }),
    updateSession: builder.mutation({
      query: ({ sessionId, sessionData }) => ({
        url: `lms_module/update_session/${sessionId}/`,  // Dynamically insert sessionId into the URL
        method: 'PUT',
        body: sessionData, // Session data like name, venue, etc.
      }),
      transformResponse: (response) => response,
    }),
  }),
});
export const { 
  useCreateClassroomMutation,     
  useGetClassroomsQuery,          
  useUpdateClassroomMutation, 
  useCreateSessionMutation,
  useGetSessionsQuery,   
  useMarkSessionCompletedMutation,
  useUpdateSessionMutation,
} = classRoomApi;
