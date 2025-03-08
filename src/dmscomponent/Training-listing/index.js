import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import ChecklistIcon from "@mui/icons-material/Checklist";
import QuizIcon from "@mui/icons-material/Quiz";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const TrainingListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const group = user?.user_permissions?.group || {};
  const groupId = group.id;
  // Fetch training data using the API query hook
  const { data, error, isLoading, refetch } = useFetchTrainingsQuery();
  
  const [startAssessmentModal, setStartAssessmentModal] = useState(false);
  const [failedAssessmentModal, setFailedAssessmentModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleAssesmentModalClose = () => {
    setStartAssessmentModal(false);
    setSelectedRowData(null);
  };

  const handleFailedAssessmentModalClose = () => {
    setFailedAssessmentModal(false);
    setSelectedRowData(null);
  };

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
    navigate("/questions", { state: { rowData } });
  };

  const handleQuizClick = (DataQuiz) => {
    navigate("/quiz-list", { state: { DataQuiz } });
  };

  const handleAssessmentClick = (rowId) => {
    // Get the document data for the selected row
    const document = data?.document_data?.documents.find(doc => doc.id === rowId);
    setSelectedRowData(rowId);
    
    // Check if the user has a failed quiz session for this document
    if (document && document.quiz_sessions) {
      const userQuizSession = document.quiz_sessions.find(
        session => session.user === user.id
      );
      
      if (userQuizSession && userQuizSession.status === "Failed") {
        // Show the failed assessment modal
        setFailedAssessmentModal(true);
      } else {
        // Show the regular assessment modal
        setStartAssessmentModal(true);
      }
    } else {
      // If no quiz sessions exist, show the regular assessment modal
      setStartAssessmentModal(true);
    }
  };

  const startAssessmentClick = () => {
    if (selectedRowData) {
      navigate("/mcq-module", { state: { rowData: selectedRowData } });
      handleAssesmentModalClose();
    }
  };

  const goToClassroomActivities = () => {
    // Navigate to classroom activities page
    navigate("/classroom-activities");
    handleFailedAssessmentModalClose();
  };

  const handleview = (item) => {
    const documentUrl = item;
    if (documentUrl) {
      navigate("/training-document-view", { state: { docId: item.docId, templateId: item.templateId } });
    }
  };

  const filteredData = (
    Array.isArray(data?.document_data?.documents) ? data.document_data?.documents : []
  )
    .filter((item) => item.document_title.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((item, index) => {
      return {
        id: item.id,
        serial_number: index + 1,
        document_name: item.document_title,
        document_type: item.document_type_name,
        document_number: item.document_number,
        version: item.version,
        created_date: moment(item.created_at).format("DD-MM-YY"),
        status: item.current_status_name,
        revision_date: item.revision_month,
        effective_date: moment(item.created_at).format("DD-MM-YY"),
        selected_template_url: item.selected_template_url,
        user_view: item.user_view,
        docId: item.id,
        templateId: item.select_template,
        quiz_sessions: item.quiz_sessions
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
    { field: "effective_date", headerName: "Effective Date", flex: 1, headerAlign: "center" },
    {
      field: "action",
      headerName: "Action",
      flex: 0.8,
      headerAlign: "center",
      renderCell: (params) => (
        <MDBox display="flex" gap={1}>
          <IconButton
            color="success"
            onClick={() => {
              handleview(params.row);
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
                <IconButton color="error" onClick={() => handleQuestionClick(params.row.id)}>
                  <QuestionAnswerOutlinedIcon />
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
                <IconButton color="secondary" onClick={() => handleQuizClick(params.row)}>
                  <QuizIcon />
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
      renderCell: (params) => {
        const isUserInView = params.row?.user_view?.some(view => view.user === user.id);
        
        // Check if this document has a failed quiz session for the current user
        const document = data?.document_data?.documents.find(doc => doc.id === params.row.id);
        const userQuizSession = document?.quiz_sessions?.find(session => session.user === user.id);
        const hasFailedStatus = userQuizSession?.status === "Failed";
        const hasPassedStatus = userQuizSession?.status === "passed";
        
        return (
          // <MDBox display="flex" justifyContent="center">
          
          //   <IconButton 
          //     disabled={!isUserInView} 
          //     color={hasFailedStatus ? "warning" : "error"} 
          //     onClick={() => handleAssessmentClick(params.row.id)}
          //   >
          //     {hasFailedStatus ? <WarningIcon /> : <ChecklistIcon />}
          //   </IconButton>
          // </MDBox>
          <MDBox display="flex" justifyContent="center">
          {hasPassedStatus ? (
            <IconButton disabled>
              {/* <ChecklistIcon style={{ color: "green" }} /> Green checkmark */}
              <CheckCircleIcon style={{ color: "green" }} />
            </IconButton>
          ) : (
            <IconButton
              disabled={!params.row?.user_view?.some(view => view.user === user.id)}
              color={hasFailedStatus ? "warning" : "error"}
              onClick={() => handleAssessmentClick(params.row.id)}
            >
              {hasFailedStatus ? <WarningIcon /> : <ChecklistIcon />}
            </IconButton>
          )}
        </MDBox>
        );
      },
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
                  minWidth: 1500,
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

      {/* Regular Assessment Modal */}
      <Dialog
        open={startAssessmentModal}
        onClose={handleAssesmentModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Start Assessment?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to start the assessment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAssesmentModalClose}>
            Cancel
          </Button>  
          <Button onClick={startAssessmentClick} autoFocus color="primary" variant="contained">
            Start Assessment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Failed Assessment Modal */}
      <Dialog
        open={failedAssessmentModal}
        onClose={handleFailedAssessmentModalClose}
        aria-labelledby="failed-assessment-dialog-title"
        aria-describedby="failed-assessment-dialog-description"
      >
        <DialogTitle id="failed-assessment-dialog-title" sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
          <WarningIcon color="error" sx={{ mr: 1 }} />
          {"Assessment Failed"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="failed-assessment-dialog-description">
            You have failed this assessment after 3 attempts. Please complete the required classroom activities before attempting again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFailedAssessmentModalClose}>
            Close
          </Button>  
          {/* <Button onClick={goToClassroomActivities} color="primary" variant="contained" autoFocus>
            Go to Classroom Activities
          </Button> */}
        </DialogActions>
      </Dialog>
    </MDBox>
  );
};

export default TrainingListing;