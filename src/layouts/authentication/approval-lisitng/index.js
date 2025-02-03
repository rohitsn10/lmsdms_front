import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalPrintshopTwoToneIcon from "@mui/icons-material/LocalPrintshopTwoTone";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useGetPrintRequestsQuery } from "api/auth/printApi";
import { useFetchPermissionsByGroupIdQuery } from "api/auth/permissionApi";
import { hasPermission } from "utils/hasPermission";
import { useAuth } from "hooks/use-auth";
import ApprovalDialog from "./add-approval/index";
import PrintDocumentDialog from "./print-window/index";
import { usePrintRequestExcelReportQuery } from "api/auth/printApi";
import moment from "moment";
import { useViewStatusQuery } from "api/auth/statusApi";
import MDButton from "components/MDButton";

const PrintApprovalListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // Approval Dialog state
  const [selectedRequest, setSelectedRequest] = useState(null); // Selected print request data
  const [openPrintDialog, setOpenPrintDialog] = useState(false); // Print Document Dialog state
  const [selectedDocumentId, setSelectedDocumentId] = useState(null); // Store document id
  const [Selectedstatus, setSelectedstatus] = useState(""); // State for Parent Document selection
  const { data: status, isError } = useViewStatusQuery();
  const {
    data: printRequests,
    error,
    isLoading,
    refetch,
  } = useGetPrintRequestsQuery(Selectedstatus);
  const { user } = useAuth();
  const group = user?.user_permissions?.group || {};
  const groupId = group.id;
  const {
    data: excelReportData,
    isLoading: isExcelLoading,
    error: excelError,
  } = usePrintRequestExcelReportQuery(Selectedstatus);
  const { data: userPermissions = [], isError: permissionError } =
    useFetchPermissionsByGroupIdQuery(groupId?.toString(), {
      skip: !groupId, // Ensure it skips if groupId is missing
    });
  useEffect(() => {
    refetch();
  }, [location.key]);

  // Conditionally set the Selectedstatus based on the groupId
  useEffect(() => {
    if (groupId === 5 || groupId === 6) {
      setSelectedstatus("12"); // Set default status as "12" for groupId 5 or 6
    } else {
      setSelectedstatus("all"); // Set default as "all" for other groups
    }
  }, [groupId]);

  // Fetch print requests filtered by selected status

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = (printRequests || [])
    .filter(
      (item) =>
        item.document_title && item.document_title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .reverse()
    .map((item, index) => ({
      ...item,
      serial_number: index + 1,
    }));

  const handleOpenDialog = (data) => {
    setSelectedRequest(data); // Store the selected request
    setOpenDialog(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
    setSelectedRequest(null); // Clear selected data
  };
  const handleDownloadExcel = () => {
    if (excelReportData && excelReportData.status && excelReportData.data) {
      const fileUrl = excelReportData.data; // Extract file URL from the response
      window.open(fileUrl, "_blank"); // Open the file URL in a new tab to download
    }
  };
  const handleOpenPrintDialog = (documentId, noOfRequestByAdmin) => {
    setSelectedDocumentId(documentId); // Store the document id
    setSelectedRequest({ ...selectedRequest, no_of_request_by_admin: noOfRequestByAdmin }); // Store no_of_request_by_admin
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
        const date = params.row.created_at ? moment(params.row.created_at).format("DD/MM/YY") : "-";
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
            <IconButton
              color="primary" // Static color for the print icon
              onClick={() =>
                handleOpenPrintDialog(params.row.sop_document_id, params.row.no_of_request_by_admin)
              } // Open PrintDialog with document id
              disabled={params.row.status !== "Approve"} // Disable button if status is not "Approve"
            >
              <LocalPrintshopTwoToneIcon />
            </IconButton>
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

          {/* Conditionally render the status dropdown based on groupId */}
          {groupId !== 5 && groupId !== 6 && (
            <FormControl fullWidth margin="dense" sx={{ width: "250px" }}>
              <InputLabel id="select-parent-doc-label">Status</InputLabel>
              <Select
                labelId="select-parent-doc-label"
                id="select-parent-doc"
                value={Selectedstatus}
                onChange={(e) => setSelectedstatus(e.target.value)}
                input={<OutlinedInput label="Status" />}
                sx={{
                  minWidth: 200,
                  height: "2.4rem",
                  ".MuiSelect-select": { padding: "0.45rem" },
                }}
              >
                <MenuItem value="all">All</MenuItem>
                {status?.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <MDTypography
            variant="h4"
            fontWeight="medium"
            sx={{ flexGrow: 1, textAlign: "center", mr: 20 }}
          >
            Print Approval Listing
          </MDTypography>

          <MDButton
            variant="gradient"
            color="submit"
            sx={{ ml: 2 }}
            onClick={handleDownloadExcel}
            disabled={isExcelLoading || excelError}
          >
            {isExcelLoading ? "Generating Excel..." : "Generate Excel"}
          </MDButton>
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
          id={selectedDocumentId}
          noOfRequestByAdmin={selectedRequest?.no_of_request_by_admin}
        />
      )}
    </MDBox>
  );
};

export default PrintApprovalListing;
