import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const userApi = createApi({
    reducerPath: 'userApi',
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
        createUser: builder.mutation({
            query: (body) => ({
                url: 'user_profile/user_create',
                method: 'POST',
                body,
            }),
        }),
        userList: builder.query({
            query: () => 'user_profile/user_list',
        }),
    }),
});

export const { useCreateUserMutation, useUserListQuery } = userApi;
