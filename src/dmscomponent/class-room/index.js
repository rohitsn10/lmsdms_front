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
import { useGetClassroomsQuery } from "apilms/classRoomApi"; // Import your API hook
import moment from "moment"; // For date formatting
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const ClassroomListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch classrooms using the query hook
  const { data, isLoading, isError, error } = useGetClassroomsQuery();

  // Handle search input change
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle classroom edit button click
  const handleEditClassroom = (classroom) => {
    navigate("/edit-classroom", { state: { classroom } });
  };

  // Handle session button click
  const handleSession = () => {
    navigate("/session-list");
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <MDBox sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={50} />
      </MDBox>
    );
  }

  if (isError) {
    toast.error(`Error: ${error?.message}`);
    return <MDTypography color="error.main">Failed to load classroom data.</MDTypography>;
  }

  // Filter classroom data based on search term
  const filteredData = data?.data
    .filter(
      (classroom) =>
        classroom.classroom_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((classroom, index) => ({
      ...classroom,
      serial_number: index + 1,
      start_date: moment(classroom.start_datetime).format("DD/MM/YY HH:mm"), // Use moment for formatting
    }));

  // Define the columns for the DataGrid
  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "classroom_name", headerName: "Class Name", flex: 1, headerAlign: "center" },
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
              rows={filteredData || []} // Use filteredData if available
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
