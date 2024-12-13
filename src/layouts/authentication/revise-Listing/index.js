import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import BackHandSharpIcon from '@mui/icons-material/BackHandSharp';
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ReviseApprovalList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Sample data (replace with actual data if needed)
  const reviseRequests = [
    {
      id: 1,
      documentTitle: "Document A",
      documentType: "Report",
      requestedUser: "John Doe",
      requestedDate: "2024-12-12 14:30",
      reviseStatus: "-",
    },
    {
      id: 2,
      documentTitle: "Document B",
      documentType: "Policy",
      requestedUser: "Jane Smith",
      requestedDate: "2024-12-11 16:00",
      reviseStatus: "Pending",
    },
    {
      id: 3,
      documentTitle: "Document C",
      documentType: "Guideline",
      requestedUser: "Alex Johnson",
      requestedDate: "2024-12-10 10:15",
      reviseStatus: "Approved",
    },
  ];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditRequest = (request) => {
    navigate("/update-revise-request", { state: { request } });
  };

  // Filter the requests based on search term
  const filteredData = reviseRequests.filter(
    (request) =>
      request.requestedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.documentTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "documentTitle", headerName: "Document Title", flex: 1, headerAlign: "center" },
    { field: "documentType", headerName: "Document Type", flex: 1, headerAlign: "center" },
    { field: "requestedUser", headerName: "Requested User", flex: 1, headerAlign: "center" },
    { field: "requestedDate", headerName: "Requested Date", flex: 1, headerAlign: "center" },
    { field: "reviseStatus", headerName: "Revise Status", flex: 1, headerAlign: "center" },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <MDBox display="flex" justifyContent="center" alignItems="center" gap={1}>
          <IconButton
            color="warning"
            onClick={() => handleEditRequest(params.row)}
          >
            <ImportContactsTwoToneIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => console.log("Secondary Action", params.row)}
          >
            <BackHandSharpIcon/>
          </IconButton>
          <IconButton
            color="success"
            onClick={() => console.log("Tertiary Action", params.row)}
          >
            <VisibilityIcon />
          </IconButton>
        </MDBox>
      ),
    },
    
  ];

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
            Revise Approval List
          </MDTypography>
          <MDButton
            variant="contained"
            color="primary"
            onClick={() => navigate("/add-revise-request")}
            sx={{ ml: 2 }}
          >
            Add Request
          </MDButton>
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={filteredData.map((request, index) => ({
                ...request,
                serial_number: index + 1, // Add serial_number based on the index
              }))}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              sx={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                "& .MuiDataGrid-columnHeaders": {
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-cell": {
                  textAlign: "center",
                },
              }}
            />
          </div>
        </MDBox>
      </Card>
    </MDBox>
  );
};

export default ReviseApprovalList;
