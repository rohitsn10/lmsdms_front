
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
import PrintApprovalListing from "layouts/authentication/approval-lisitng";
import PrinterListing from "layouts/authentication/printer-listing";


const routes = [
 
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
  {
    type: "collapse",
    name: "Approval",
    key: "approval-listing",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/approval-listing",
    component: <PrintApprovalListing />,
  },
  {
    type: "collapse",
    name: "Printer",
    key: "printer-listing",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "printer-listing",
    component: <PrinterListing />,
  },
];

export default routes;
