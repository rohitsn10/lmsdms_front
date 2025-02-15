// src/api/trainerApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "constants/config";

export const trainerApi = createApi({
  reducerPath: "trainerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.BACKEND_API_URL,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Trainers"],
  endpoints: (builder) => ({
    trainerCreate: builder.mutation({
      query: ({ trainer_name, description }) => ({
        url: "lms_module/trainer_create",
        method: "POST",
        body: { trainer_name, description },
      }),
      transformResponse: (response) => {
        if (response.status) {
          return response;
        }
      },
      invalidatesTags: ["Trainers"],
    }),
    fetchTrainers: builder.query({
      query: () => ({
        url: "lms_module/trainer_create",
        method: "GET",
      }),
      transformResponse: (response) => {
        if (response.status) {
          return response.data;
        }
        throw new Error(response.message || "Failed to fetch trainers");
      },
      providesTags: ["Trainers"],
    }),
    trainerUpdate: builder.mutation({
      query: ({ trainer_id, trainer_name, description }) => ({
        url: `lms_module/trainer_update/${trainer_id}`,
        method: "PUT",
        body: { trainer_name, description },
      }),
      transformResponse: (response) => {
        if (response.status) {
          return response.message;
        }
        throw new Error(response.message || "Failed to update trainer");
      },
      invalidatesTags: ["Trainers"],
    }),
  }),
});
export const { useTrainerCreateMutation, useFetchTrainersQuery, useTrainerUpdateMutation } =
  trainerApi;
