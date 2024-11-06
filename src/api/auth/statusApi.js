import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const statusApi = createApi({
  reducerPath: 'statusApi',
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
    // Mutation to create a new status
    createStatus: builder.mutation({
      query: (status) => ({
        url: 'dms_module/create_status',
        method: 'POST',
        body: { status },
      }),
      // Invalidate cache and refetch viewStatus data
      invalidatesTags: [{ type: 'Status', id: 'LIST' }],
      onQueryStarted: async (status, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled; // Wait for the mutation to complete
          // After creating the status, invalidate and refetch the list of statuses
          dispatch(statusApi.util.invalidateTags([{ type: 'Status', id: 'LIST' }]));
        } catch (error) {
          console.error('Error creating status:', error);
        }
      },
    }),

    // Mutation to update an existing status
    updateStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `dms_module/update_status/${id}`,  // Assuming PUT method for updating
        method: 'PUT',
        body: { status },
      }),
      // Invalidate cache and refetch viewStatus data
      invalidatesTags: [{ type: 'Status', id: 'LIST' }],
      onQueryStarted: async ({ id, status }, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;  // Wait for the mutation to complete
          // Invalidate the cache and refetch data after updating status
          dispatch(statusApi.util.invalidateTags([{ type: 'Status', id: 'LIST' }]));
        } catch (error) {
          console.error('Error updating status:', error);
        }
      },
    }),

    // Query to fetch all statuses
    viewStatus: builder.query({
      query: () => ({
        url: 'dms_module/view_status',
        method: 'GET',
      }),
      providesTags: ['Status'],  // This tag will be invalidated after mutations
      transformResponse: (response) => response.data || [],
    }),

    // Mutation to delete an existing status
    deleteStatus: builder.mutation({
      query: (id) => ({
        url: `dms_module/delete_status/${id}`,
        method: 'DELETE',
      }),
      // Invalidate cache and refetch viewStatus data
      invalidatesTags: [{ type: 'Status', id: 'LIST' }],
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;  // Wait for the mutation to complete
          // Invalidate the cache and refetch data after deleting status
          dispatch(statusApi.util.invalidateTags([{ type: 'Status', id: 'LIST' }]));
        } catch (error) {
          console.error('Error deleting status:', error);
        }
      },
    }),
  }),
});

export const { 
  useCreateStatusMutation, 
  useUpdateStatusMutation, 
  useViewStatusQuery, 
  useDeleteStatusMutation 
} = statusApi;
