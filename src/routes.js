/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import AddUser from "layouts/authentication/add-user";
import AddDepartment from "layouts/authentication/add-department";
import AddDocument from "layouts/authentication/add-document";
import Icon from "@mui/material/Icon";
import LMSDashboard from "layouts/authentication/lms-dashboard";
import TopicIcon from '@mui/icons-material/Topic';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DocumentListing from "layouts/authentication/document-listing";
import UsersListing from "layouts/authentication/user-listing";
import WorkflowListing from "layouts/authentication/workflow-listing";
import StatusListing from "layouts/authentication/status-handle";
import DocumentTypesListing from "layouts/authentication/document-typelisting";
import TemplateListing from "layouts/authentication/template-listing";
import InventoryListing from "layouts/authentication/inventory-handle";
import DepartmentListing from "layouts/authentication/department-listing";
import RolesPermissionsListing from "layouts/authentication/roles-listing";

const routes = [
  // {
  //   type: "collapse",
  //   name: "DocEditor",
  //   key: "DocEditor",
  //   icon: <Icon fontSize="small">login</Icon>,
  //   route: "/authentication/DocEditor",
  //   component: <DocEditor />,
  // },
  // {
  //   type: "collapse",
  //   name: "PrintDocument",
  //   key: "print-document",
  //   icon: <Icon fontSize="small">login</Icon>,
  //   route: "/authentication/print-document",
  //   component: <PrintDocument />,
  // },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "lmsDashboard",
    key: "lms-dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/lms-dashboard",
    component: <LMSDashboard />,
  },
  // {
  //   type: "collapse",
  //   name: "Watermark",
  //   key: "watermark",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/authentication/watermark",
  //   component: <Watermark />,
  // },
 
 
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: <Profile />,
  // },
  // {
  //   type: "collapse",
  //   name: "ReleaseDocument",
  //   key: "release-document",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/release-document",
  //   component: <ReleaseDocument />,
  // },
  // {
  //   type: "collapse",
  //   name: "Login",
  //   key: "log-in",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/log-in",
  //   component: <Login/>,
  // },
  // {
  //   type: "collapse",
  //   name: "ResetPassword",
  //   key: "forgot-password",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/forgot-password",
  //   component: <ResetPassword/>,
  // },
  {
    type: "collapse",
    name: "User",
    key: "user-listing",
    icon:<PersonAddIcon/>,
    route: "/user-listing",
    component: <UsersListing/>,
  },
  {
    type: "collapse",
    name: "Department",
    key: "department-listing",
    icon: <ApartmentIcon/>,
    route: "/department-listing",
    component: <DepartmentListing />,
  },
  {
    type: "collapse",
    name: "Document",
    key: "document-listing",
    icon:<TopicIcon/>,
    route: "/document-listing",
    component: <DocumentListing />,
  },
  {
    type: "collapse",
    name: "Workflow",
    key: "workflow-listing",
    icon:<TopicIcon/>,
    route: "/workflow-listing",
    component: <WorkflowListing/>,
  },
  // {
  //   type: "collapse",
  //   name: "AddApproval",
  //   key: "add-approval",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/add-approval",
  //   component: <AddApproval />,
  // },
   
  {
    type: "collapse",
    name: "Status",
    key: "status-list",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/status-list",
    component: <StatusListing />,
  },

  {
    type: "collapse",
    name: "Document Type",
    key: "document-typelisting",
    icon:<TopicIcon/>,
    route: "/document-typelisting",
    component: <DocumentTypesListing/>,
  },
  {
    type: "collapse",
    name: "Template",
    key: "template-listing",
    icon:<TopicIcon/>,
    route: "/template-listing",
    component: <TemplateListing/>,
  },


  {
    type: "collapse",
    name: "inventory",
    key: "inventory-list",
    icon:<TopicIcon/>,
    route: "/inventory-list",
    component: <InventoryListing />,
  },

  {
    type: "collapse",
    name: "Roles",
    key: "roles-listing",
    icon: <ApartmentIcon/>,
    route: "/roles-listing",
    component: <RolesPermissionsListing />,
  },
  
];

export default routes;
