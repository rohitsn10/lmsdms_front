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
import moment from "moment";

const PrintApprovalListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // State for dialog open/close
  const [selectedRequest, setSelectedRequest] = useState(null); // Selected print request data
  const { data: printRequests, error, isLoading } = useGetPrintRequestsQuery();
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = (printRequests || [])
    .filter(
      (item) =>
        item.document_title && item.document_title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .reverse() // Reverse the data so latest comes first
    .map((item, index) => ({
      ...item,
      serial_number: index + 1, // Correct sequence after reverse
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
  { 
    field: "serial_number", 
    headerName: "Sr. No.", 
    flex: 0.5, 
    headerAlign: "center", 
    renderCell: (params) => params.row.serial_number ?? "-" // Handle null or undefined
  },
  { 
    field: "document_title", 
    headerName: "Document Title", 
    flex: 1, 
    headerAlign: "center", 
    renderCell: (params) => params.row.document_title ?? "-" // Handle null or undefined
  },
  { 
    field: "no_of_print", 
    headerName: "Copies Requested", 
    flex: 1, 
    headerAlign: "center", 
    renderCell: (params) => params.row.no_of_print ?? "-" // Handle null or undefined
  },
  { 
    field: "issue_type", 
    headerName: "Issue Type", 
    flex: 1, 
    headerAlign: "center", 
    renderCell: (params) => params.row.issue_type ?? "-" // Handle null or undefined
  },
  {
    field: "created_at",
    headerName: "Date",
    flex: 1,
    headerAlign: "center",
    renderCell: (params) => {
      const date = params.row.created_at ? moment(params.row.created_at).format("DD-MM-YY HH:mm") : "-";
      return date;
    },
  },
  { 
    field: "no_of_request_by_admin", 
    headerName: "Copies Approved", 
    flex: 0.5, 
    headerAlign: "center", 
    renderCell: (params) => params.row.pending ?? "-" // Handle null or undefined
  },
  { 
    field: "status", 
    headerName: "Status", 
    flex: 1, 
    headerAlign: "center", 
    renderCell: (params) => params.row.status ?? "-" // Handle null or undefined
  },
  { 
    field: "Approve ", 
    headerName: "Approve Date", 
    flex: 1, 
    headerAlign: "center", 
    renderCell: (params) => params.row.Approve ?? "-" // Handle null or undefined
  },
  { 
    field: "first_name", 
    headerName: "User", 
    flex: 0.5, 
    headerAlign: "center", 
    renderCell: (params) => params.row.first_name ?? "-" // Handle null or undefined
  },
  {
    field: "action",
    headerName: "Action",
    flex: 0.5,
    headerAlign: "center",
    renderCell: (params) => {
      const status = params.row.status;
      let color;
  
      // Set the button color based on status
      if (status === "Approve") {
        color = "success"; // Green color for approved
      } else if (status === "Reject") {
        color = "error"; // Red color for rejected
      } else {
        color = "primary"; // Default color (blue) for null or other statuses
      }
  
      return (
        <IconButton
          color={color} // Set the color dynamically based on status
          onClick={() => handleOpenDialog(params.row)}
          disabled={status === "Approve"} // Disable button if status is "Approve"
        >
          <CheckCircleIcon />
        </IconButton>
      );
    },
  }
  
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
            {/* {filteredData.length === 0 && !isLoading && (
             <MDTypography align="center" color="textSecondary" sx={{ marginBottom: '200px' }}>
             No print approvals found
           </MDTypography>

            )} */}
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
