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
import moment from "moment"; // For date formatting

const ClassroomListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Static classroom data (this would be your mock data)
  const classrooms = [
    {
      id: 1,
      class_name: "Math 101",
      start_datetime: "2025-01-22T09:00:00Z",
      class_description: "Introduction to Algebra",
    },
    {
      id: 2,
      class_name: "History 202",
      start_datetime: "2025-01-22T10:00:00Z",
      class_description: "World History Overview",
    },
    {
      id: 3,
      class_name: "Physics 303",
      start_datetime: "2025-01-22T11:00:00Z",
      class_description: "Fundamentals of Mechanics",
    },
    // Add more classrooms as needed
  ];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClassroom = (classroom) => {
    navigate("/edit-classroom", { state: { classroom } });
  };

  const handleSession = () => {
    navigate("/session-list");
  };
  // Filter classroom data based on search term
  const filteredData = classrooms
    .filter(
      (classroom) =>
        classroom.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.class_description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((classroom, index) => ({
      ...classroom,
      serial_number: index + 1,
      start_date: moment(classroom.start_datetime).format("DD/MM/YY HH:mm"), // Use moment for formatting
    }));

  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "class_name", headerName: "Class Name", flex: 1, headerAlign: "center" },
    { field: "start_date", headerName: "Start Date & Time", flex: 1, headerAlign: "center" },
    {
      field: "session",
      headerName: "Session",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <MDButton variant="outlined" color="primary" onClick={handleSession}>
          Start Session
        </MDButton>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleEditClassroom(params.row)}>
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
            Class Room Listing
          </MDTypography>
          <MDButton
            variant="contained"
            color="primary"
            onClick={() => navigate("/classroom-training")}
            sx={{ ml: 2 }}
          >
            Add Classroom
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

export default ClassroomListing;
