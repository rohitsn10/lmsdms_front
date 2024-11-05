// src/api/workflowApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const workflowApi = createApi({
    reducerPath: 'workflowApi',
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
        createWorkflow: builder.mutation({
            query: (body) => ({
                url: 'dms_module/create_get_workflow',
                method: 'POST',
                body,
            }),
        }),
        fetchWorkflows: builder.query({
            query: () => 'dms_module/create_get_workflow', // Adjusted for GET request
            transformResponse: (response) => {
                // Assuming the response structure you provided
                if (response.status) {
                    return response.data; // Return the data array directly
                }
                throw new Error(response.message || 'Failed to fetch workflows'); // Handle errors
            },
        }),
    }),
});

export const { useCreateWorkflowMutation, useFetchWorkflowsQuery } = workflowApi;
