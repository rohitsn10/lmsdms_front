import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.BACKEND_API_URL, // Make sure to replace with your actual backend API URL
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
    // Query to fetch dashboard counts
    getDashboardCounts: builder.query({
      query: () => 'dms_module/DashboardCount',
      transformResponse: (response) => response.data,  // Ensure response data is correctly formatted
    }),
  }),
});

export const { useGetDashboardCountsQuery } = dashboardApi;
