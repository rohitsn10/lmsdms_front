import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useFetchTrainersQuery } from "api/auth/trainerApi";
import moment from "moment";

const TrainerListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data: response, isLoading, isError, refetch } = useFetchTrainersQuery();

  useEffect(() => {
    refetch();  
  }, [refetch]);

  console.log(response);
  // Ensure that trainers data is available
  const trainers = response || [];  // Safe access using optional chaining


  // If data is being fetched or an error occurs
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading trainers.</div>;
  }

  // Search function to filter trainer list
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle editing a trainer
  const handleEditTrainer = (trainer) => {
    navigate("/edit-trainer", { state: { trainer } });
  };

  // Filter trainers based on search term
  const filteredData = trainers
    .filter(
      (trainer) =>
        trainer.trainer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((trainer, index) => ({
      id: trainer.id,  // Ensure unique id for each row
      serial_number: index + 1,
      trainer_name: trainer.trainer_name,
      description: trainer.description,
      created_at: moment(trainer.created_at).format("DD-MM-YY"),  // Format the date
    }));

  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "trainer_name", headerName: "Trainer Name", flex: 1, headerAlign: "center" },
    { field: "description", headerName: "Trainer Description", flex: 1.5, headerAlign: "center" },
    { field: "created_at", headerName: "Created At", flex: 1.5, headerAlign: "center" },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleEditTrainer(params.row)}>
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
            Trainer Listing
          </MDTypography>
          <MDButton variant="contained" color="primary" onClick={() => navigate("/add-trainer")} sx={{ ml: 2 }}>
            Add Trainer
          </MDButton>
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={filteredData} // Ensure the rows are correctly structured
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

export default TrainerListing;
