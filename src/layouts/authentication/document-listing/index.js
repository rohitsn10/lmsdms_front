import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFetchDocumentsQuery } from "api/auth/documentApi";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import PreviewIcon from "@mui/icons-material/Preview";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { hasPermission } from "utils/hasPermission";
import PropTypes from "prop-types";
import { useFetchPermissionsByGroupIdQuery } from "api/auth/permissionApi";
import { useAuth } from "hooks/use-auth";
import moment from "moment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ConditionalDialog from "./effective";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BrowserUpdatedOutlinedIcon from "@mui/icons-material/BrowserUpdatedOutlined";
// import ReviseDialog from "./Revise";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import ChildDocumentsDialog from "./child-document";
const DocumentListing = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { data, refetch, isLoading, isError } = useFetchDocumentsQuery();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [userGroupIds, setUserGroupIds] = useState([]);
  const [isReviseDialogOpen, setReviseDialogOpen] = useState(false); // Unique state for ReviseDialog
  const [reviseDocument, setReviseDocument] = useState(null); // Unique state for selected document
  const [openChildDialog, setOpenChildDialog] = useState(false);
  const [selectedChildDocuments, setSelectedChildDocuments] = useState([]);

  useEffect(() => {
    if (data && data.userGroupIds) {
      setUserGroupIds(data.userGroupIds);
      console.log("User Group IDssss:", data.userGroupIds); // Corrected property name
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [location.key]);

  // Extract revision_month from data
  const revisionMonth = data?.revision_month;

  // console.log("Documents:", data?.documents || []);
  // console.log("User Group IDs:", data?.userGroupIds || []);

  const group = user?.user_permissions?.group || {};
  const groupId = group.id;

  const documents = data?.documents || [];

  const { data: userPermissions = [], isError: permissionError } =
    useFetchPermissionsByGroupIdQuery(groupId?.toString(), {
      skip: !groupId,
    });

  const handleDialogOpen = (row) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };
  const handleViewChildDocuments = (row) => {
   setSelectedRow(row);
    setSelectedChildDocuments([]); 
    setOpenChildDialog(true); 
  };
  
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleAddDocument = () => {
    navigate("/add-document");
  };
  const handleObsolete = () => {
    navigate("/Obsolete-data");
  };
  const handleClick = (params) => {
    if (!params || !params.row) {
      console.error("Invalid params object:", params);
      return; // Exit if params or row is missing
    }

    const { id, document_current_status, training_required, approval_status } = params.row;

    // Ensure required fields are defined
    if (
      id === undefined ||
      document_current_status === undefined ||
      training_required === undefined ||
      approval_status === undefined
    ) {
      console.error("Missing data in params.row:", params.row);
      return;
    }

    navigate(
      `/document-view/${id}?status=${document_current_status}&training_required=${training_required},&approval_status=${approval_status}`
    );
    // console.log("Navigated with:", {
    //   id,
    //   document_current_status,
    //   training_required,
    //   approval_status,
    // });
  };
  const handleReviseDialogOpen = (row) => {
    setSelectedRow(row);
    setReviseDialogOpen(true);
  };

  const handleReviseDialogClose = () => {
    setReviseDialogOpen(false);
    setReviseDocument(null);
  };
  const isButtonVisible = () => {
    return roles.some((role) => role.id === 4);
  };
  const handleReviseConfirm = () => {
    console.log("Revise confirmed for document:", reviseDocument);
    // Add any additional logic here
    handleReviseDialogClose();
  };
  const handleViewFile = (url) => {
    navigate("/PreView", { state: { templateDoc: url } }); // Pass the URL as state
  };

  const handleEditClick = (rowData) => {
    navigate("/edit-document", { state: { item: rowData } });
    console.log("Full Row Data passed", rowData);
  };

  const filteredData = documents.filter(
    (doc) =>
      doc.document_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.created_at.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rows = filteredData.map((doc, index) => ({
    ...doc,
    index,
    created_at: moment(doc.created_at).format("DD/MM/YY"),
  }));
  const columns = [
    {
      field: "index",
      headerName: "Sr.No.",
      flex: 0.3,
      headerAlign: "center",
      renderCell: (params) => <span>{params.row.index + 1}</span>,
      sortable: false,
      filterable: false,
    },
    {
      field: "document_title",
      headerName: "Title",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "document_type_name",
      headerName: "Type",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "sop_icon",
      headerName: "SOP Action",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => {
        const isSOP = params.row.document_type_name === "SOP";
        return (
          <MDBox display="flex" justifyContent="center">
            <IconButton
              color="success"
              onClick={() => handleViewChildDocuments(params.row)}
              disabled={!isSOP} // Disable if document type is not SOP
            >
              <FolderSharedOutlinedIcon /> {/* Replace with the desired icon */}
            </IconButton>
          </MDBox>
        );
      },
      sortable: false,
      filterable: false,
    },
    {
      field: "document_number",
      headerName: "Document No.",
      flex: 0.55,
      headerAlign: "center",
    },
    {
      field: "version",
      headerName: "Version",
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "created_at",
      headerName: "Created Date",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "current_status_name",
      headerName: "Status",
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "revision_date",
      headerName: "Revision Date",
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "effective_date",
      headerName: "Effective Date",
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0.7,
      headerAlign: "center",
      renderCell: (params) => (
        <MDBox display="flex" gap={1}>
          {hasPermission(userPermissions, "document", "isChange") && (
            <IconButton color="primary" onClick={() => handleEditClick(params.row)}>
              <EditIcon />
            </IconButton>
          )}
          <IconButton
            color="primary"
            onClick={() => handleViewFile(params.row.selected_template_url)}
          >
            <VisibilityIcon />
          </IconButton>
          {params.row.form_status === "save_draft"
            ? hasPermission(userPermissions, "document", "isView") && (
                <IconButton
                  color="secondary"
                  onClick={() => {
                    console.log("Params passed to handleClick:", params);
                    handleClick(params);
                  }}
                >
                  <PreviewIcon />
                </IconButton>
              )
            : hasPermission(userPermissions, "document", "isView") && (
                <IconButton
                  color="inherit"
                  onClick={() => {
                    console.log("Params passed to handleClick:", params);
                    handleClick(params);
                  }}
                >
                  <EditCalendarIcon />
                </IconButton>
              )}
          {data?.userGroupIds?.includes(5) && ( // Hide CheckCircleIcon when status is 7
            <IconButton
              color="success"
              onClick={() => handleDialogOpen(params.row)}
              disabled={params.row.document_current_status !== 9} // Disable if condition not met
            >
              <CheckCircleIcon />
            </IconButton>
          )}

          {/* {params.row.document_current_status === 7 && ( // Show ImportContactsTwoToneIcon when status is 7
            <IconButton
              color="warning"
              onClick={() => handleReviseDialogOpen(params.row)}
            >
              <ImportContactsTwoToneIcon />
            </IconButton>
          )} */}
        </MDBox>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: "preview_download",
      headerName: "Download",
      flex: 0.4,
      headerAlign: "center",
      renderCell: (params) => (
        <MDBox display="block">
          <IconButton
            color="primary"
            onClick={() => {
              navigate("/PDFPreview", {
                state: {
                  documentId: params.row.id,
                },
              });
            }}
            disabled={params.row.document_current_status !== 9}
          >
            <BrowserUpdatedOutlinedIcon />
          </IconButton>
        </MDBox>
      ),
      sortable: false,
      filterable: false,
    },
  ];
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching documents.</div>;
  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center">
          <MDInput
            label="Search"
            variant="outlined"
            size="small"
            sx={{ width: "250px", mr: 2 }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center" }}>
            Document Listing
          </MDTypography>
          {isButtonVisible && (
            <MDButton variant="contained" color="primary" onClick={handleObsolete} sx={{ ml: 2 }}>
              Obsolete
            </MDButton>
          )}

          {hasPermission(userPermissions, "document", "isAdd") && (
            <MDButton
              variant="contained"
              color="primary"
              onClick={handleAddDocument}
              sx={{ ml: 2 }}
            >
              Add Document
            </MDButton>
          )}
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: "100%", overflow: "auto" }}>
            <DataGrid
              rows={rows || []}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{
                minWidth: 1500,
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                  textAlign: "center",
                  justifyContent: "center",
                },
                "& .MuiDataGrid-cell": {
                  textAlign: "center",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  textAlign: "center",
                  width: "100%",
                },
              }}
            />
          </div>
        </MDBox>
      </Card>
      <ConditionalDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={() => console.log("Confirmed for row:", selectedRow)}
        trainingStatus={selectedRow?.training_required || "false"}
        documentId={selectedRow?.id || ""}
        revisionMonth={selectedRow?.revision_month}
      />
      <ChildDocumentsDialog
        open={openChildDialog}
        onClose={() => setOpenChildDialog(false)}
        documentId={selectedRow?.id || ""}
      />
      {/* <ReviseDialog
  open={isReviseDialogOpen}
  onClose={() => setReviseDialogOpen(false)}
  onConfirm={handleReviseConfirm}
  documentId={selectedRow?.id|| ""} 
  // You can pass more fields like selectedRow or row as needed
/> */}
    </MDBox>
  );
};

DocumentListing.propTypes = {
  userPermissions: PropTypes.arrayOf(
    PropTypes.shape({
      resource: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default DocumentListing;
