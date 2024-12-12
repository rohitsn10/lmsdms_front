import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

const ReviseApprovalList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Sample data (replace with actual data if needed)
  const reviseRequests = [
    { id: 1, requestedUser: "John Doe", time: "2024-12-12 14:30", documentName: "Document A" },
    { id: 2, requestedUser: "Jane Smith", time: "2024-12-11 16:00", documentName: "Document B" },
    { id: 3, requestedUser: "Alex Johnson", time: "2024-12-10 10:15", documentName: "Document C" },
    // Add more sample data or fetch from an API
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
      request.documentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "requestedUser", headerName: "Requested User", flex: 1, headerAlign: "center" },
    { field: "time", headerName: "Time", flex: 1, headerAlign: "center" },
    { field: "documentName", headerName: "Document Name", flex: 1, headerAlign: "center" },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleEditRequest(params.row)}>
          <EditIcon />
        </IconButton>
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
