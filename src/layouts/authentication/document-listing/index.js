import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchDocumentsQuery } from 'api/auth/documentApi';
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

const DocumentListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { data, isLoading, isError } = useFetchDocumentsQuery();

  // Log API response for debugging
  console.log("Fetched Data:", data);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddDocument = () => {
    navigate("/add-document");
  };

  const filteredData = data?.filter((doc) =>
    doc.document_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_number.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const columns = [
    { field: 'id', headerName: 'Sr. No.', flex: 0.5, headerAlign: 'center' },
    { field: 'document_title', headerName: 'Title', flex: 1, headerAlign: 'center' },
    { field: 'document_type_name', headerName: 'Type', flex: 1, headerAlign: 'center' },
    { field: 'document_number', headerName: 'Document No.', flex: 1, headerAlign: 'center' },
    { field: 'formatted_created_at', headerName: 'Created Date', flex: 0.75, headerAlign: 'center' },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0.5,
      headerAlign: 'center',
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => navigate("/add-document")}
        >
          <EditIcon />
        </IconButton>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching documents.</div>;

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3 }}>
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
          <MDButton variant="contained" color="primary" onClick={handleAddDocument} sx={{ ml: 2 }}>
            Add Document
          </MDButton>
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={filteredData || []}
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

export default DocumentListing;
