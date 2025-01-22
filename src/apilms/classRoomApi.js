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
      transformResponse: (response) => response, // Handle raw response
    }),
  }),
});
export const { 
  useCreateClassroomMutation,     // Hook for creating a classroom
  useGetClassroomsQuery,          // Hook for retrieving classrooms
  useUpdateClassroomMutation,     // Hook for updating a classroom
} = classRoomApi;
