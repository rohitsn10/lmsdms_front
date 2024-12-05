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


import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import ApprovalIcon from '@mui/icons-material/ThumbUp';
import Inventory2Icon from '@mui/icons-material/Inventory2';

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <DashboardIcon fontSize="small" />,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "LMS Dashboard",
    key: "lms-dashboard",
    icon: <DashboardIcon fontSize="small" />,
    route: "/lms-dashboard",
    component: <LMSDashboard />,
  },
  {
    type: "collapse",
    name: "User Management",
    key: "user-listing",
    icon: <PersonAddIcon />,
    route: "/user-listing",
    component: <UsersListing />,
  },
  {
    type: "collapse",
    name: "Departments",
    key: "department-listing",
    icon: <ApartmentIcon />,
    route: "/department-listing",
    component: <DepartmentListing />,
  },
  {
    type: "collapse",
    name: "Documents",
    key: "document-listing",
    icon: <LibraryBooksIcon />,
    route: "/document-listing",
    component: <DocumentListing />,
  },
  {
    type: "collapse",
    name: "Workflows",
    key: "workflow-listing",
    icon: <WorkspacesIcon />,
    route: "/workflow-listing",
    component: <WorkflowListing />,
  },
  {
    type: "collapse",
    name: "Status Management",
    key: "status-list",
    icon: <SettingsIcon />,
    route: "/status-list",
    component: <StatusListing />,
  },
  {
    type: "collapse",
    name: "Document Types",
    key: "document-typelisting",
    icon: <AssignmentIcon />,
    route: "/document-typelisting",
    component: <DocumentTypesListing />,
  },
  {
    type: "collapse",
    name: "Templates",
    key: "template-listing",
    icon: <TopicIcon />,
    route: "/template-listing",
    component: <TemplateListing />,
  },
  {
    type: "collapse",
    name: "Inventory",
    key: "inventory-list",
    icon: <Inventory2Icon />,
    route: "/inventory-list",
    component: <InventoryListing />,
  },
  {
    type: "collapse",
    name: "Roles & Permissions",
    key: "roles-listing",
    icon: <SettingsIcon />,
    route: "/roles-listing",
    component: <RolesPermissionsListing />,
  },
  {
    type: "collapse",
    name: "Approvals",
    key: "approval-listing",
    icon: <ApprovalIcon />,
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
