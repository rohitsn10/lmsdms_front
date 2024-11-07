import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/auth/userApi";
import { documentApi } from "./api/auth/documentApi";
import { workflowApi } from "./api/auth/workflowApi";
import { forgotPassApi } from "api/auth/forgotpassApi";
import { statusApi } from "api/auth/statusApi";
import { departmentApi } from "api/auth/departmentApi"; 

const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [workflowApi.reducerPath]: workflowApi.reducer,
    [forgotPassApi.reducerPath]: forgotPassApi.reducer,
    [statusApi.reducerPath]: statusApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      documentApi.middleware,
      workflowApi.middleware,
      forgotPassApi.middleware,
      statusApi.middleware,
      departmentApi.middleware 
    ),
});

if (process.env.NODE_ENV !== "production") {
  const { enableMapSet } = require("immer");
  enableMapSet();
}

export default store;
