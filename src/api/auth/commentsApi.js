import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "constants/config";

export const commentApi = createApi({
  reducerPath: "commentApi",
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
    // Create a new comment
    createComment: builder.mutation({
      query: ({ document, comment_description }) => ({
        url: "dms_module/create_comment",
        method: "POST",
        body: { document, comment_description },
      }),
      transformResponse: (response) => ({
        status: response.status,
        message: response.message,
      }),
    }),
  }),
});

export const {
  useCreateCommentMutation, // Export the mutation hook
} = commentApi;
