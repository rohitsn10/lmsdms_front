import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/auth/userApi";
import { documentApi } from "./api/auth/documentApi";
import { workflowApi } from "./api/auth/workflowApi";
import { forgotPassApi } from "api/auth/forgotpassApi";
import { statusApi } from "api/auth/statusApi";
import { inventoryApi } from "api/auth/inventoryApi";
import { texteditorApi } from "api/auth/texteditorApi";
import { departmentApi } from "api/auth/departmentApi"; 
import { dashboardApi } from "api/auth/dashboardApi";
import { esignatureApi } from "api/auth/esignatureApi";
import { permissionApi } from "api/auth/permissionApi";
import { editDocumentApi } from "api/auth/editDocumentApi";
import { commentApi } from "api/auth/commentsApi";
import { printApi } from "api/auth/printApi";
import { switchRoleApi } from "api/auth/switchRoleApi";
import { printerApi } from "api/auth/PrinterApi";

const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [workflowApi.reducerPath]: workflowApi.reducer,
    [forgotPassApi.reducerPath]: forgotPassApi.reducer,
    [statusApi.reducerPath]: statusApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer, 
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [texteditorApi.reducerPath]: texteditorApi.reducer,
    [esignatureApi.reducerPath]:esignatureApi.reducer,
    [permissionApi.reducerPath]:permissionApi.reducer,
    [editDocumentApi.reducerPath]: editDocumentApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [printApi.reducerPath]: printApi.reducer,
    [switchRoleApi.reducerPath]:switchRoleApi.reducer,
    [printerApi.reducerPath]: printerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      documentApi.middleware,
      workflowApi.middleware,
      forgotPassApi.middleware,
      statusApi.middleware,
      inventoryApi.middleware,
      departmentApi.middleware,
      dashboardApi.middleware,
      texteditorApi.middleware,
      esignatureApi.middleware,
      permissionApi.middleware,
      editDocumentApi.middleware,
      commentApi.middleware,
      printApi.middleware,
      switchRoleApi.middleware,
      printerApi.middleware,
    ),
});

if (process.env.NODE_ENV !== "production") {
  const { enableMapSet } = require("immer");
  enableMapSet();
}

export default store;
