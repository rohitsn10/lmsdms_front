import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

const PrinterListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Mock data for printers
  const mockPrinters = [
    { id: 1, serial_number: 1, printer_name: "Printer A", printer_location: "Room 101" },
    { id: 2, serial_number: 2, printer_name: "Printer B", printer_location: "Room 102" },
    { id: 3, serial_number: 3, printer_name: "Printer C", printer_location: "Room 103" },
    { id: 4, serial_number: 4, printer_name: "Printer D", printer_location: "Room 104" },
    { id: 5, serial_number: 5, printer_name: "Printer E", printer_location: "Room 105" },
  ];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditPrinter = (printer) => {
    navigate("/update-printer", { state: { printer } });
  };

  const filteredData = mockPrinters.filter(
    (printer) =>
      printer.printer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      printer.printer_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "printer_name", headerName: "Printer Name", flex: 1, headerAlign: "center" },
    { field: "printer_location", headerName: "Printer Location", flex: 1.5, headerAlign: "center" },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleEditPrinter(params.row)}>
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
            Printer Listing
          </MDTypography>
          <MDButton
            variant="contained"
            color="primary"
            onClick={() => navigate("/add-printer")}
            sx={{ ml: 2 }}
          >
            Add Printer
          </MDButton>
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

export default PrinterListing;
