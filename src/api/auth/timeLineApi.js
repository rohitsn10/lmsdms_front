import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "constants/config";

export const timeLineApi = createApi({
  reducerPath: "timeLineApi",
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
   
    docTimeLine: builder.query({
      query: (document_id) => ({
        url: `dms_module/doc_timeline/${document_id}`,  
        method: "GET",
      }),
      transformResponse: (response) => response, 
    }),

   

  }),
});

export const { useDocTimeLineQuery } = timeLineApi;
