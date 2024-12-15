import React, { useState } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import moment from "moment";
import PrintRetrievalDialog from "./retrievaldialog";

const mockData = [
  {
    id: 1,
    document_title: "Project Report",
    no_of_print: 10,
    issue_type: "Urgent",
    created_at: "2024-12-12T10:30:00",
    no_of_request_by_admin: 5,
    status: "Pending",
    Approve: "-",
    first_name: "John",
  },
  {
    id: 2,
    document_title: "Invoice",
    no_of_print: 20,
    issue_type: "Regular",
    created_at: "2024-12-10T12:00:00",
    no_of_request_by_admin: 15,
    status: "Approved",
    Approve: "2024-12-10",
    first_name: "Jane",
  },
  {
    id: 3,
    document_title: "Meeting Agenda",
    no_of_print: 5,
    issue_type: "Urgent",
    created_at: "2024-12-11T09:00:00",
    no_of_request_by_admin: 5,
    status: "Rejected",
    Approve: "-",
    first_name: "Alice",
  },
];

const PrintRetrievalListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRetrieval, setSelectedRetrieval] = useState(null);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDialogOpen = (row) => {
    setSelectedRetrieval(row.document_title);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRetrieval(null);
  };

  const handleRetrieve = (retrievalNumber) => {
    console.log(`Retrieving document: ${retrievalNumber}`);
  };

  const filteredData = mockData
    .filter(
      (item) =>
        item.document_title &&
        item.document_title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .reverse()
    .map((item, index) => ({
      ...item,
      serial_number: index + 1,
    }));

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
      field: "issue_type",
      headerName: "Issue Type",
      flex: 1,
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
          ? moment(params.row.created_at).format("DD-MM-YY HH:mm")
          : "-";
        return date;
      },
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
      renderCell: (params) => params.row.Approve ?? "-",
    },
    {
      field: "first_name",
      headerName: "User",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => params.row.first_name ?? "-",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleDialogOpen(params.row)}
        >
          <AssignmentReturnIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <MDBox p={3}>
      <Card
        sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}
      >
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
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Print Retrieval Listing
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: "100%" }}>
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
      <PrintRetrievalDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        retrievalOptions={["12345", "67890", "11223"]} // Example options
        onRetrieve={handleRetrieve}
      />
    </MDBox>
  );
};

export default PrintRetrievalListing;
