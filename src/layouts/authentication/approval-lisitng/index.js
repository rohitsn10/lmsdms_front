import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { useGetPrintRequestsQuery } from "api/auth/printApi";
import ApprovalDialog from "./add-approval/index"; // Import the dialog component

const PrintApprovalListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // State for dialog open/close
  const [selectedRequest, setSelectedRequest] = useState(null); // Selected print request data
  const { data: printRequests, error, isLoading } = useGetPrintRequestsQuery();
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = (printRequests || [])
    .filter((item) => item.document_title && item.document_title.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((item, index) => ({
      ...item,
      serial_number: index + 1,
      created_at: new Date(item.created_at).toLocaleDateString("en-GB"),
    }));

  const handleOpenDialog = (data) => {
    setSelectedRequest(data); // Store the selected request
    setOpenDialog(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
    setSelectedRequest(null); // Clear selected data
  };

  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "document_title", headerName: "Document Title", flex: 1, headerAlign: "center" },
    { field: "no_of_print", headerName: "No. of Copies", flex: 1, headerAlign: "center" },
    { field: "issue_type", headerName: "Issue Type", flex: 1, headerAlign: "center" },
    { field: "created_at", headerName: "Created At", flex: 1, headerAlign: "center" },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleOpenDialog(params.row)}>
          <CheckCircleIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center">
          <MDInput
            label="Search Document"
            variant="outlined"
            size="small"
            sx={{ width: "250px", mr: 2 }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center" }}>
            Print Approval Listing
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: "100%" }}>
            {isLoading && (
              <MDTypography align="center" color="textSecondary">
                Loading...
              </MDTypography>
            )}
            {error && (
              <MDTypography align="center" color="error">
                Failed to load print requests
              </MDTypography>
            )}
            <DataGrid
              rows={filteredData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              sx={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-cell": {
                  textAlign: "center",
                },
              }}
            />
            {filteredData.length === 0 && !isLoading && (
              <MDTypography align="center" color="textSecondary">
                No print approvals found
              </MDTypography>
            )}
          </div>
        </MDBox>
      </Card>

      {/* Render ApprovalDialog */}
      {selectedRequest && (
        <ApprovalDialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxCopies={selectedRequest.no_of_print} // Pass max copies to the dialog
           requestId={selectedRequest.id}
        />
      )}
    </MDBox>
  );
};

export default PrintApprovalListing;
