import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "constants/config";  // Ensure this file has the correct BACKEND_API_URL

export const retrievalApi = createApi({
  reducerPath: "retrievalApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.BACKEND_API_URL,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getApprovedPrintList: builder.query({
      query: () => ({
        url: "dms_module/get_approved_print_list", // Your API endpoint
        method: "GET",
      }),
      transformResponse: (response) => response.data, // Extract the 'data' array from the response
    }),
  }),
});

export const { useGetApprovedPrintListQuery } = retrievalApi;
