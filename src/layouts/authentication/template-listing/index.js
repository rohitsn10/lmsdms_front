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
import { useViewTemplateQuery } from "api/auth/documentApi";

const TemplateListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch templates data
  const { data, error, isLoading } = useViewTemplateQuery();

  const handleAddTemplate = () => {
    navigate("/add-template");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Prepare filtered data with serial numbers
  const filteredData = (data || [])
    .filter((item) => item.template_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((item, index) => ({
      ...item,
      serial_number: index + 1,
      created_at: new Date(item.created_at).toLocaleDateString("en-GB"), // Format date as DD/MM/YYYY
    }));

  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "template_name", headerName: "Template Name", flex: 1, headerAlign: "center" },
    { field: "created_at", headerName: "Created At", flex: 1, headerAlign: "center" },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => navigate(`/add-template/${params.id}`)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: 'auto', marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center">
          <MDInput
            label="Search Template"
            variant="outlined"
            size="small"
            sx={{ width: "250px", mr: 2 }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center" }}>
            Template Listing
          </MDTypography>
          <MDButton variant="contained" color="primary" onClick={handleAddTemplate} sx={{ ml: 2 }}>
            Add Template
          </MDButton>
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          {error ? (
            <MDTypography color="error">Error fetching templates</MDTypography>
          ) : (
            <div style={{ height: 500, width: "100%" }}>
              <DataGrid
                rows={filteredData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                loading={isLoading}
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
              {!isLoading && filteredData.length === 0 && (
                <MDTypography align="center" color="textSecondary">
                  No templates found
                </MDTypography>
              )}
            </div>
          )}
        </MDBox>
      </Card>
    </MDBox>
  );
};

export default TemplateListing;
