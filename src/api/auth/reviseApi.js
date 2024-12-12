import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "constants/config";

export const reviseApi = createApi({
  reducerPath: "reviseApi",
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
    reviseRequest: builder.mutation({
        query: ({ document_id, revise_description }) => ({
          url: "dms_module/revise_request",
          method: "POST",
          body: { document_id, revise_description },
        }),
        transformResponse: (response) => response.data, // Handle the response
      }),
  }),
});

export const {  useReviseRequestMutation, } = reviseApi;
