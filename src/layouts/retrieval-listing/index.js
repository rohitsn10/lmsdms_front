import React, { useState } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { useGetApprovedPrintListQuery } from "api/auth/retrievalApi"; // Import the API hook
import PrintRetrievalDialog from "./retrievaldialog";
import ApprovedRetrievalListingDialog from "./approve-list";
import moment from "moment";

const PrintRetrievalListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [approvedDialogOpen, setApprovedDialogOpen] = useState(false);
  const [selectedApprovedRetrieval, setSelectedApprovedRetrieval] = useState(null);
  const [selectedRetrieval, setSelectedRetrieval] = useState(null);

  // Fetch data using the API hook
  const { data, error, isLoading } = useGetApprovedPrintListQuery();

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDialogOpen = (row) => {
    setSelectedRetrieval({ document_title: row.document_title, id: row.id });
    setDialogOpen(true);
    console.log("Selected Retrieval:", { document_title: row.document_title, id: row.id });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRetrieval(null);
  };

  const handleApprovedDialogOpen = (row) => {
    // Function to open ApprovedRetrievalListingDialog
    setSelectedApprovedRetrieval(row); // Store selected row for the approved dialog
    setApprovedDialogOpen(true);
  };
  const handleApprovedDialogClose = () => {
    // Function to close ApprovedRetrievalListingDialog
    setApprovedDialogOpen(false);
    setSelectedApprovedRetrieval(null);
  };

  const handleRetrieve = (retrievalNumber) => {
    console.log(`Retrieving document: ${retrievalNumber}`);
  };

  // Filter data based on search term
  const filteredData = data
    ? data
        .filter(
          (item) =>
            item.document_title &&
            item.document_title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((item, index) => ({
          ...item,
          serial_number: index + 1,
        }))
    : [];

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
      headerName: "Document Title",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => params.row.document_title ?? "-",
    },
    {
      field: "no_of_print",
      headerName: "Copies Requested",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => params.row.no_of_print ?? "-",
    },
    {
      field: "no_of_request_by_admin",
      headerName: "Copies Approved",
      flex: 0.5,
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
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => moment(params.row.created_at).format("YYYY-MM-DD") ?? "-",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleDialogOpen(params.row)}>
            <AssignmentReturnIcon />
          </IconButton>
          <IconButton color="info" onClick={() => handleApprovedDialogOpen(params.row)}>
            <ArticleRoundedIcon />
          </IconButton>
        </>
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
            Print Retrieval Listing
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: "100%" }}>
            {isLoading ? (
              <MDTypography variant="body1" sx={{ textAlign: "center" }}>
                Loading...
              </MDTypography>
            ) : error ? (
              <MDTypography variant="body1" sx={{ textAlign: "center", color: "red" }}>
                Error fetching data
              </MDTypography>
            ) : (
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
            )}
          </div>
        </MDBox>
      </Card>
      <PrintRetrievalDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        selectedId={selectedRetrieval?.id}
        onRetrieve={handleRetrieve}
      />
      <ApprovedRetrievalListingDialog
        open={approvedDialogOpen}
        handleClose={handleApprovedDialogClose}
        selectedId={selectedRetrieval?.id} // Ensure `selectedRetrieval` is not undefined
        onRetrieve={handleRetrieve}
        data={selectedRetrieval?.data || []} // Ensure `data` is always an array
      />
    </MDBox>
  );
};

export default PrintRetrievalListing;
