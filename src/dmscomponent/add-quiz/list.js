import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useGetTrainingQuizzesQuery } from "apilms/quizapi"; // Update with the correct API hook

const QuizListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { row } = location.state || {}; 
  console.log("row data++++++++++++++++++++++++++++",row);
  const { data: response, isLoading, isError, refetch } = useGetTrainingQuizzesQuery();

  useEffect(() => {
    refetch();
  }, []);

  const quizzes = response?.data || [];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditQuiz = (quiz) => {
    navigate("/edit-quiz", { state: { quiz } });
  };

  const filteredData = quizzes
    .filter(
      (quiz) =>
        quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((quiz, index) => ({
      ...quiz,
      serial_number: index + 1,
      quiz_time: `${quiz.time} mins`, // Format quiz time
    }));

  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "name", headerName: "Quiz Name", flex: 1, headerAlign: "center" },
    { field: "type", headerName: "Quiz Type", flex: 1, headerAlign: "center" },
    { field: "quiz_time", headerName: "Quiz Time", flex: 1, headerAlign: "center" },
    { field: "pass_criteria", headerName: "Pass Criteria", flex: 1, headerAlign: "center" },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleEditQuiz(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading quizzes.</div>;
  }

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
            Quiz Listing
          </MDTypography>
          <MDButton
            variant="contained"
            color="primary"
            onClick={() => navigate("/add-quiz")}
            sx={{ ml: 2 }}
          >
            Add Quiz
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

export default QuizListing;
