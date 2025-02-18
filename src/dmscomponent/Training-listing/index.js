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
import { useAuth } from "hooks/use-auth";
import moment from "moment";
import { useFetchTrainingsQuery } from "apilms/trainingApi"; // Update this path as needed
import VisibilityIcon from "@mui/icons-material/Visibility";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import { Button } from "@mui/material";
import ChecklistIcon from "@mui/icons-material/Checklist";
import QuizIcon from "@mui/icons-material/Quiz";
const TrainingListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const group = user?.user_permissions?.group || {};
  const groupId = group.id;
  // Fetch training data using the API query hook
  const { data, error, isLoading, refetch } = useFetchTrainingsQuery();

  useEffect(() => {
    refetch();
  }, [location.key]);

  const handleAddTraining = () => {
    navigate("/add-training");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditTraining = (item) => {
    navigate("/edit-training", { state: { item } });
  };
  const handleQuestionClick = (rowData) => {
    // console.log("Question icon clicked for row:", rowData);
    navigate("/questions", { state: { rowData } });
    // You can implement additional logic here, such as opening a modal, navigating to another page, etc.
  };
  const handleQuizClick = (DataQuiz) => {
    navigate("/quiz-list", { state: { DataQuiz } });
  };
  const handleAssessmentClick = (rowData) => {
    navigate("/mcq-module", { state: { rowData } });
  };
  const handleview = (item) => {
    const documentUrl = item;
    if (documentUrl) {
      console.log("Passing training_document:", item);
      navigate("/LMS-Document", { state: { documentView: item } });
    } else {
      console.error("training_document is undefined or missing for this item", item);
    }
  };
  const filteredData = (
    Array.isArray(data?.document_data?.documents) ? data.document_data?.documents : []
  )
    .filter((item) => item.document_title.toLowerCase().includes(searchTerm.toLowerCase())) // Filter by title
    .map((item, index) => {
      // console.log("Created at:", item.created_at); // Log the created_at field to check it
      return {
        id: item.id,
        serial_number: index + 1,
        document_name: item.document_title,
        document_type: item.document_type_name,
        document_number: item.document_number,
        version: item.version,
        created_date: moment(item.created_at).format("DD-MM-YY"), // Format the date
        status: item.current_status_name,
        revision_date: item.revision_month, // Revision month
        effective_date: moment(item.created_at).format("DD-MM-YY"), // Use created_at for now
        selected_template_url:item.selected_template_url,
      };
    });

  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "document_name", headerName: "Title", flex: 1.5, headerAlign: "center" },
    { field: "document_type", headerName: "Type", flex: 1, headerAlign: "center" },
    { field: "document_number", headerName: "Document No", flex: 1.5, headerAlign: "center" },
    { field: "version", headerName: "Version", flex: 0.8, headerAlign: "center" },
    { field: "created_date", headerName: "Created Date", flex: 1, headerAlign: "center" },
    { field: "status", headerName: "Status", flex: 1, headerAlign: "center" },
    // { field: "revision_date", headerName: "Revision Date", flex: 1, headerAlign: "center" },
    { field: "effective_date", headerName: "Effective Date", flex: 1, headerAlign: "center" },
    {
      field: "action",
      headerName: "Action",
      flex: 0.8,
      headerAlign: "center",
      renderCell: (params) => (
        <MDBox display="flex" gap={1}>
          {/* Edit button */}
          <IconButton
            color="info"
            onClick={() => handleEditTraining(params.row)} 
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="success"
            onClick={() => {
              console.log("params.row:", params.row); 
              handleview(params.row.selected_template_url);
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </MDBox>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: "material",
      headerName: "Material",
      flex: 0.8,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <MDBox display="flex" justifyContent="center">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ff3f3f",
                borderRadius: "20px",
                color: "white !important",
                padding: "2px 16px",
                fontSize: "12px",
                minHeight: "unset",
                height: "32px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "red",
                  color: "white",
                },
              }}
              onClick={() => navigate(`/training-material/${params.row.id}`)}
            >
              Material
            </Button>
          </MDBox>
        );
      },
    },
    ...(groupId === 7
      ? [
          {
            field: "question",
            headerName: "Question",
            flex: 0.8,
            headerAlign: "center",
            renderCell: (params) => (
              <MDBox display="flex" justifyContent="center">
                {/* Question Icon */}
                <IconButton color="error" onClick={() => handleQuestionClick(params.row.id)}>
                  <QuestionAnswerOutlinedIcon />{" "}
                  {/* Assuming you are using a Question Icon, like 'QuestionAnswerIcon' */}
                </IconButton>
              </MDBox>
            ),
            sortable: false,
            filterable: false,
          },
        ]
      : []),
    ...(groupId === 7
      ? [
          {
            field: "Quiz",
            headerName: "Quiz",
            flex: 0.8,
            headerAlign: "center",
            renderCell: (params) => (
              <MDBox display="flex" justifyContent="center">
                {/* Question Icon */}
                <IconButton color="secondary" onClick={() => handleQuizClick(params.row)}>
                  <QuizIcon />{" "}
                  {/* Assuming you are using a Question Icon, like 'QuestionAnswerIcon' */}
                </IconButton>
              </MDBox>
            ),
            sortable: false,
            filterable: false,
          },
        ]
      : []),
    {
      field: "Assessment",
      headerName: "Assessment",
      flex: 0.8,
      headerAlign: "center",
      renderCell: (params) => (
        <MDBox display="flex" justifyContent="center">
          {/* Question Icon */}
          <IconButton color="error" onClick={() => handleAssessmentClick(params.row.id)}>
            <ChecklistIcon />{" "}
          </IconButton>
        </MDBox>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center">
          <MDInput
            label="Search Training"
            variant="outlined"
            size="small"
            sx={{ width: "250px", mr: 2 }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center" }}>
            Training Listing
          </MDTypography>
          {/* <MDButton variant="contained" color="primary" onClick={handleAddTraining} sx={{ ml: 2 }}>
            Add Training
          </MDButton> */}
        </MDBox>

        {isLoading ? (
          <MDTypography variant="h5" sx={{ textAlign: "center" }}>
            Loading...
          </MDTypography>
        ) : error ? (
          <MDTypography variant="h5" sx={{ textAlign: "center", color: "red" }}>
            Error fetching training data
          </MDTypography>
        ) : (
          <MDBox display="flex" justifyContent="center" p={2}>
            <div style={{ height: 500, width: "100%", overflow: "auto" }}>
              <DataGrid
                rows={filteredData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                sx={{
                  minWidth: 1500, // Ensure the minimum width allows for scrolling
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
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                }}
              />
            </div>
          </MDBox>
        )}
      </Card>
    </MDBox>
  );
};

export default TrainingListing;
