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
            query: () => 'dms_module/create_get_workflow',
            transformResponse: (response) => {
                if (response.status) {
                    return response.data;
                }
                throw new Error(response.message || 'Failed to fetch workflows');
            },
        }),
        updateWorkflow: builder.mutation({
            query: ({ workflow_id, workflow_name, workflow_description }) => ({
                url: `dms_module/update_delete_workflow/${workflow_id}`,
                method: 'PUT',
                body: { workflow_name, workflow_description },
            }),
        }),
    }),
});

export const { useCreateWorkflowMutation, useFetchWorkflowsQuery, useUpdateWorkflowMutation } = workflowApi;
