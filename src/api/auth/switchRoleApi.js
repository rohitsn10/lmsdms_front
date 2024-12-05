// src/api/switchRoleApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const switchRoleApi = createApi({
    reducerPath: 'switchRoleApi',
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
        requestUserGroupList: builder.query({
            query: () => ({
                url: 'user_profile/requestuser_group_list',
                method: 'GET',
            }),
        }),
    }),
});

export const { useRequestUserGroupListQuery } = switchRoleApi;
