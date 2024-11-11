import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
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
    // Mutation to create a new inventory
    createinventory: builder.mutation({
      query: (inventory) => ({
        url: 'dms_module/CreateInventory',
        method: 'POST',
        body: { inventory },
      }),
      // Invalidate cache and refetch viewInventory data
      invalidatesTags: [{ type: 'inventory', id: 'LIST' }],
      onQueryStarted: async (inventory, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled; // Wait for the mutation to complete
          // After creating the inventory, invalidate and refetch the list of inventory
          dispatch(inventoryApi.util.invalidateTags([{ type: 'inventory', id: 'LIST' }]));
        } catch (error) {
          console.error('Error creating Inventory:', error);
        }
      },
    }),

    // Mutation to update an existing inventory
    updateinventory: builder.mutation({
      query: ({ id, inventory }) => ({
        url: `dms_module/UpdateInventory/${id}`,  // Assuming PUT method for updating
        method: 'PUT',
        body: { inventory },
      }),
      // Invalidate cache and refetch viewinventory data
      invalidatesTags: [{ type: 'inventory', id: 'LIST' }],
      onQueryStarted: async ({ id, inventory }, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;  // Wait for the mutation to complete
          // Invalidate the cache and refetch data after updating inventory
          dispatch(inventoryApi.util.invalidateTags([{ type: 'inventory', id: 'LIST' }]));
        } catch (error) {
          console.error('Error updating inventory:', error);
        }
      },
    }),

    // Query to fetch all inventory
    viewinventory: builder.query({
      query: () => ({
        url: 'dms_module/ViewInventory',
        method: 'GET',
      }),
      providesTags: ['inventory'],  // This tag will be invalidated after mutations
      transformResponse: (response) => response.data || [],
    }),

    // Mutation to delete an existing inventory
    deleteinventory: builder.mutation({
      query: (id) => ({
        url: `dms_module/DeleteInventory/${id}`,
        method: 'DELETE',
      }),
      // Invalidate cache and refetch viewinventory data
      invalidatesTags: [{ type: 'inventory', id: 'LIST' }],
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;  // Wait for the mutation to complete
          // Invalidate the cache and refetch data after deleting inventory
          dispatch(inventoryApi.util.invalidateTags([{ type: 'inventory', id: 'LIST' }]));
        } catch (error) {
          console.error('Error deleting inventory:', error);
        }
      },
    }),
  }),
});

export const { 
  useCreateinventoryMutation, 
  useUpdateinventoryMutation, 
  useViewinventoryQuery, 
  useDeleteinventoryMutation 
} = inventoryApi;
