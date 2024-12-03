import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchDocumentsQuery } from 'api/auth/documentApi';
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import PreviewIcon from '@mui/icons-material/Preview';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { hasPermission } from "utils/hasPermission"; 
import PropTypes from 'prop-types'; 
import {useFetchPermissionsByGroupIdQuery} from "api/auth/permissionApi"
import { useAuth } from "hooks/use-auth";
import moment from "moment";

const DocumentListing = () => {
  const {user, role} = useAuth()
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { data, isLoading, isError } = useFetchDocumentsQuery();
  console.log("USER_ROLE", role)
  const documents = data?.documents || []; 
  const {data: userPermissions = [], isError: permissionError} = useFetchPermissionsByGroupIdQuery(role.toString(), {
    skip: !role
  });
  console.log("USER_PERMISSIONS", userPermissions)
  console.log("pERMISSON_ERROR",permissionError)

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleAddDocument = () => {
    navigate("/add-document");
  };
  const handleClick = (params) => {
    if (!params || !params.row) {
      console.error("Invalid params object:", params);
      return; // Exit if params or row is missing
    }
  
    const { id, document_current_status, training_required } = params.row;
  
    // Ensure required fields are defined
    if (
      id === undefined ||
      document_current_status === undefined ||
      training_required === undefined
    ) {
      console.error("Missing data in params.row:", params.row);
      return;
    }
  
    // Navigate with all required data
    navigate(
      `/document-view/${id}?status=${document_current_status}&training_required=${training_required}`
    );
    console.log("Navigated with:", {
      id,
      document_current_status,
      training_required,
    });
  };
  
  
  
  const handleEditClick = (id) => {
    navigate(`/edit-document/${id}`);
    console.log('Edit-Document id passed', id);
  };
  const filteredData = documents.filter((doc) =>
    doc.document_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_number.toLowerCase().includes(searchTerm.toLowerCase())||
    doc.created_at.toLowerCase().includes(searchTerm.toLowerCase())  );

  const rows = filteredData.map((doc, index) => ({
    ...doc,
    index,
    created_at: moment(doc.created_at).format("DD-MM-YY HH:mm"), 
  }));
  const columns = [
    {
      field: 'index',
      headerName: 'Sr. No.',
      flex: 0.4,
      headerAlign: 'center',
      renderCell: (params) => <span>{params.row.index + 1}</span>,
      sortable: false,
      filterable: false,
    },
    {
      field: 'document_title',
      headerName: 'Title',
      flex: 1,
      headerAlign: 'center'
    },
    {
      field: 'document_type_name',
      headerName: 'Type',
      flex: 1,
      headerAlign: 'center'
    },
    {
      field: 'document_number',
      headerName: 'Document No.',
      flex: 0.75,
      headerAlign: 'center'
    },
    {
      field: 'version',
      headerName: 'Version',
      flex: 0.75,
      headerAlign: 'center'
    },
    {
      field: 'created_at',
      headerName: 'Created Date',
      flex: 0.75,
      headerAlign: 'center'
    },
    { 
      field: 'current_status_name', 
      headerName: 'Status', 
      flex: 0.75, 
      headerAlign: 'center' 
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0.5,
      headerAlign: 'center',
      renderCell: (params) => (
        <MDBox display="flex" gap={1}>
          {hasPermission(userPermissions, "document", "isChange") && (
            <IconButton
              color="primary"
              onClick={() => handleEditClick(params.row.id)}
            >
              <EditIcon />
            </IconButton>
          )}
    
          {params.row.form_status === 'save_draft' ? (
            hasPermission(userPermissions, "document", "isView") && (
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
          ) : (
            hasPermission(userPermissions, "document", "isView") && (
              <IconButton
                color="inherit"
                onClick={() => {
                  console.log("Params passed to handleClick:", params);
                  handleClick(params);
                }}
                
              >
                <EditCalendarIcon />
              </IconButton>
            )
          )}
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
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: 'auto', marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center">
          <MDInput
            label="Search"
            variant="outlined"
            size="small"
            sx={{ width: '250px', mr: 2 }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Document Listing
          </MDTypography>
          {hasPermission(userPermissions, "document", "isAdd") && (
            <MDButton variant="contained" color="primary" onClick={handleAddDocument} sx={{ ml: 2 }}>
              Add Document
            </MDButton>
          )}
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={rows || []}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  justifyContent: 'center',
                },
                '& .MuiDataGrid-cell': {
                  textAlign: 'center',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  textAlign: 'center',
                  width: '100%',
                },
              }}
            />
          </div>
        </MDBox>
      </Card>
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