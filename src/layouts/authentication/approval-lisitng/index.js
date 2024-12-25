import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalPrintshopTwoToneIcon from "@mui/icons-material/LocalPrintshopTwoTone";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { useGetPrintRequestsQuery } from "api/auth/printApi";
import { useFetchPermissionsByGroupIdQuery } from "api/auth/permissionApi";
import { hasPermission } from "utils/hasPermission";
import { useAuth } from "hooks/use-auth";
import ApprovalDialog from "./add-approval/index"; // Import the dialog component
import PrintDocumentDialog from "./print-window/index"; // Import the new dialog component
import moment from "moment";

const PrintApprovalListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // State for Approval Dialog
  const [selectedRequest, setSelectedRequest] = useState(null); // Selected print request data
  const [openPrintDialog, setOpenPrintDialog] = useState(false); // State for Print Document Dialog
  const [selectedDocumentId, setSelectedDocumentId] = useState(null); // Store document id for printing
  const { data: printRequests, error, isLoading } = useGetPrintRequestsQuery();

  const { user } = useAuth();
  const group = user?.user_permissions?.group || {};
  const groupId = group.id;

  const { data: userPermissions = [], isError: permissionError } = useFetchPermissionsByGroupIdQuery(groupId?.toString(), {
    skip: !groupId, // Ensure it skips if groupId is missing
  });

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

  const handleOpenPrintDialog = (documentId) => {
    setSelectedDocumentId(documentId); // Store the document id
    console.log("document id in dialog : ------------------------------------", documentId);
    setOpenPrintDialog(true); // Open the print document dialog
  };

  const handleClosePrintDialog = () => {
    setOpenPrintDialog(false); // Close the print document dialog
    setSelectedDocumentId(null); // Clear the selected document id
  };

  const columns = [
    {
      field: "serial_number",
      headerName: "Sr. No.",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => params.row.serial_number ?? "-",
    },
    {
      field: "document_title",
      headerName: "Document",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => params.row.document_title ?? "-",
    },
    {
      field: "no_of_print",
      headerName: "Requested",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => params.row.no_of_print ?? "-",
    },
    {
      field: "sop_document_id",
      headerName: "Issue Type",
      flex: 0.75,
      headerAlign: "center",
      renderCell: (params) => params.row.issue_type ?? "-",
    },
    {
      field: "created_at",
      headerName: "Date",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        const date = params.row.created_at
          ? moment(params.row.created_at).format("DD/MM/YY")
          : "-";
        return date;
      },
    },
    {
      field: "no_of_request_by_admin",
      headerName: "Approved",
      flex: 0.75,
      headerAlign: "center",
      renderCell: (params) => params.row.no_of_request_by_admin ?? "-",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => params.row.status ?? "-",
    },
    {
      field: "Approve",
      headerName: "Approve Date",
      flex: 0.75,
      headerAlign: "center",
      renderCell: (params) => params.row.Approve ?? "-",
    },
    {
      field: "first_name",
      headerName: "User",
      flex: 0.75,
      headerAlign: "center",
      renderCell: (params) => params.row.first_name ?? "-",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
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
          color = "success"; // Default color (blue) for null or other statuses
        }

        return (
          <MDBox display="flex" gap={1} justifyContent="center" alignItems="center">
            {hasPermission(userPermissions, "printrequestapproval", "isChange") && (
              <IconButton
                color={color} // Set the color dynamically based on status
                onClick={() => handleOpenDialog(params.row)}
                disabled={status === "Approve"} // Disable button if status is "Approve"
              >
                <CheckCircleIcon />
              </IconButton>
            )}

            {hasPermission(userPermissions, "printrequestapproval", "isPrint") && (
              <IconButton
                color="primary" // Static color for the print icon
                onClick={() => handleOpenPrintDialog(params.row.sop_document_id)} // Open PrintDialog with document id
                disabled={params.row.status !== "Approve"} // Disable button if status is not "Approve"
              >
                <LocalPrintshopTwoToneIcon />
              </IconButton>
            )}
          </MDBox>
        );
      },
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
          <MDTypography
            variant="h4"
            fontWeight="medium"
            sx={{ flexGrow: 1, textAlign: "center", mr: 20 }}
          >
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
          </div>
        </MDBox>
      </Card>

      {/* Render ApprovalDialog */}
      {selectedRequest && (
        <ApprovalDialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxCopies={selectedRequest.no_of_print}
          requestId={selectedRequest.id}
        />
      )}

      {/* Render PrintDocumentDialog */}
      {openPrintDialog && (
        <PrintDocumentDialog
          open={openPrintDialog}
          onClose={handleClosePrintDialog}
          id={selectedDocumentId} // Pass the document id to fetch and print the document
        />
      )}
    </MDBox>
  );
};

export default PrintApprovalListing;
