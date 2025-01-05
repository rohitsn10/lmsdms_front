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
    tagTypes: ['UserList'], // Define a tag for the user list data
    endpoints: (builder) => ({
        createUser: builder.mutation({
            query: (body) => ({
                url: 'user_profile/user_create',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['UserList'], // Invalidate the user list cache after user creation
        }),

        userList: builder.query({
            query: () => 'user_profile/user_list',
            providesTags: ['UserList'], // Tag the user list data for cache management
        }),
        reviewerUsers: builder.query({
            query: () => 'user_profile/reviewer_users',
            providesTags: ['UserList'], // Tag reviewer users data for cache management
        }),

        // Fetch approver users
        approverUsers: builder.query({
            query: () => 'user_profile/approver_users',
            providesTags: ['UserList'], // Tag approver users data for cache management
        }),

        // Fetch document admin users
        docAdminUsers: builder.query({
            query: () => 'user_profile/docadmin_users',
            providesTags: ['UserList'], // Tag doc admin users data for cache management
        }),
    }),
});

export const {
     useCreateUserMutation,
     useUserListQuery,
     useReviewerUsersQuery,
     useApproverUsersQuery,
     useDocAdminUsersQuery
     } = userApi;
