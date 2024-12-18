import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import BackHandSharpIcon from "@mui/icons-material/BackHandSharp";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import ReviseDialog from "./Revise";
import ReviseApproveDialog from "./Approve";
import { useReviseRequestGetQuery } from "api/auth/reviseApi"; // Adjust import as per your API slice location

const ReviseApprovalList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isReviseDialogOpen, setReviseDialogOpen] = useState(false);
  const [isApproveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // API call to fetch data
  const { data: apiData, isLoading } = useReviseRequestGetQuery();

  // Extract data and user_group_id from API response
  const userGroupId = apiData?.user_group_id || null;
  const apiDocuments = apiData?.data || [];

  //console.log("User Group ID:", userGroupId); // Log user_group_id

  // Format data for DataGrid
  const formattedData = apiDocuments.map((doc, index) => ({
    id: doc.document_id,
    serial_number: index + 1,
    documentTitle: doc.document_title,
    documentType: doc.document_type,
    requestedUser: `${doc.user}`,
    requestedDate: new Date(doc.revision_created_at).toLocaleDateString(),
    reviseStatus: doc.status,
    revisereason: doc.revise_description,
  }));

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleReviseDialogOpen = (row) => {
    setSelectedRow(row);
    setReviseDialogOpen(true);
  };

  const handleReviseDialogClose = () => {
    setReviseDialogOpen(false);
  };

  const handleApproveDialogOpen = (row) => {
    setSelectedRow(row);
    setApproveDialogOpen(true);
  };

  const handleApproveDialogClose = () => {
    setApproveDialogOpen(false);
  };

  const handleApprove = (reason) => {
    console.log("Approved with reason:", reason, "for document:", selectedRow);
    handleApproveDialogClose();
  };

  const handleReject = (reason) => {
    console.log("Rejected with reason:", reason, "for document:", selectedRow);
    handleApproveDialogClose();
  };

  // Filter data based on the search term
  const displayedData = formattedData.filter(
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
      renderCell: (params) => {
        // Directly compare userGroupId with the value you want (e.g., 5)
        const showApproveButton = userGroupId === 5 && params.row.reviseRequestId !== null;
        const showReviseButton = params.row.reviseRequestId === null;
    
        return (
          <MDBox display="flex" justifyContent="center" alignItems="center" gap={1}>
            {showReviseButton && (
              <IconButton color="warning" onClick={() => handleReviseDialogOpen(params.row)}>
                <BackHandSharpIcon />
              </IconButton>
            )}
    
            {showApproveButton && (
              <IconButton color="primary" onClick={() => handleApproveDialogOpen(params.row)}>
                <ImportContactsTwoToneIcon />
              </IconButton>
            )}
          </MDBox>
        );
      },
    }
    
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
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          {isLoading ? (
            <MDTypography variant="h6" textAlign="center">
              Loading...
            </MDTypography>
          ) : (
            <div style={{ height: 500, width: "100%" }}>
              <DataGrid
                rows={displayedData}
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
          )}
        </MDBox>
      </Card>

      <ReviseDialog
        open={isReviseDialogOpen}
        onClose={handleReviseDialogClose}
        documentId={selectedRow?.id || ""}
      />

      <ReviseApproveDialog
        open={isApproveDialogOpen}
        onClose={handleApproveDialogClose}
        onApprove={handleApprove}
        onReject={handleReject}
        row={selectedRow}
      />
    </MDBox>
  );
};

export default ReviseApprovalList;
