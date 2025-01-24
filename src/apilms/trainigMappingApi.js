import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "constants/config";

export const trainingMappingApi = createApi({
  reducerPath: "trainingMappingApi",
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
  endpoints: (builder) => ({
    jobroleAssignTraining: builder.mutation({
      query: ({ training_id, job_role_ids }) => ({
        url: `lms_module/jobrole_assign_training/${training_id}`, // URL with dynamic training_id
        method: "PUT",
        body: {
          job_role_ids, 
        },
      }),
      transformResponse: (response) => response, // Handle the response data if needed
    }),
    trainingList: builder.query({
      query: () => ({
        url: "lms_module/training_list",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),
    jobTrainingList: builder.query({
      query: ({ plantId, departmentId, areaId }) => ({
        url: `lms_module/job_training_list?plant_id=${plantId}&department_id=${departmentId}&area_id=${areaId}`,
        method: "GET", // GET method
      }),
      transformResponse: (response) => response.data, // Handle the response data
    }),
    jobTrainingListMapping: builder.query({
      query: ({job_role_id}) => ({
        url: `lms_module/job_training_list_mapping`,
        method: "GET",
        body: {
          job_role_id, 
        },
      }),
      transformResponse: (response) => response.data,
    }),
    trainingListData: builder.query({
      query: ({ training_type }) => ({
        url: `lms_module/training_list_data?training_type=${training_type}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data, // Handle the response data
    }),
    trainingAssignJobrole: builder.mutation({
      query: ({ job_role_id, training_ids }) => ({
        url: `lms_module/training_assign_jobrole`,
        method: "POST",
        body: {
          job_role_id, // The job role ID to which the trainings will be assigned
          training_ids, // An array of training IDs to assign
        },
      }),
      transformResponse: (response) => response, // Handle the response
    }),
  }),
});

export const {
  useJobroleAssignTrainingMutation,
  useTrainingListQuery,
  useJobTrainingListQuery,
  useJobTrainingListMappingQuery,
  useTrainingListDataQuery,
  useTrainingAssignJobroleMutation,
} = trainingMappingApi;
