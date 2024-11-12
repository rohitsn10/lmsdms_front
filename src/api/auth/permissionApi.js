import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const permissionApi = createApi({
    reducerPath: 'permissionApi',
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
        fetchPermissions: builder.query({
            query: () => 'user_profile/permission_list',
            transformResponse: (response) => {
                if (response.status) {
                    return response.data;
                }
                throw new Error(response.message || 'Failed to fetch permissions');
            },
        }),
        createGroupWithPermissions: builder.mutation({
            query: ({ name, permissions }) => ({
                url: 'user_profile/group_create_with_permissions',
                method: 'POST',
                body: { name, permissions },
            }),
        }),
    }),
});

export const { useFetchPermissionsQuery, useCreateGroupWithPermissionsMutation } = permissionApi;
