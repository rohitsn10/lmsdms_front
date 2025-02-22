import React, { useState,useEffect} from "react";
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
import { useGetTrainingAttendanceSheetQuery } from "apilms/reportsApi";
import { useAuth } from "hooks/use-auth";

const ClassroomListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const group = user?.user_permissions?.group || {};
  const groupId = group.id;

  // Fetch classrooms using the query hook
  const { data, isLoading, isError, error } = useGetClassroomsQuery();
  const [downloadDocumentId, setDownloadDocumentId] = useState(null);
  const {
    data: attendanceSheetData,
    isFetching: isFetchingAttendanceSheet,
    isError: isAttendanceSheetError,
    error: attendanceSheetError,
  } = useGetTrainingAttendanceSheetQuery(downloadDocumentId, {
    skip: !downloadDocumentId, // Skip the query if downloadDocumentId is not set
  });
  // Handle search input change
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle classroom edit button click
  const handleEditClassroom = (classroom) => {
    navigate("/edit-classroom", { state: { classroom } });
  };

  // Handle session button click
  const handleSession = (classroom) => {
    navigate("/session-list", { state: { classroom } });
  };

  const handleAssessmentClick = (rowData) => {
    navigate("/exam-mcq-module", { state: { rowData } });
  };
  const handleDownloadAttendanceSheet = (documentId) => {
    setDownloadDocumentId(documentId);
    toast.info("Downloading attendance sheet...", { autoClose: 2000 }); // Show loading toast
  };

  useEffect(() => {
    if (attendanceSheetData && downloadDocumentId) {
      // Create a Blob URL for the file
      const url = window.URL.createObjectURL(new Blob([attendanceSheetData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `attendance_sheet_${downloadDocumentId}.pdf`); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      // Reset states after download
      setDownloadDocumentId(null); // Reset the document ID
      toast.success("Attendance sheet downloaded successfully!", { autoClose: 3000 }); // Show success toast
    }
  }, [attendanceSheetData, downloadDocumentId]);

  // Handle error in attendance sheet download
  useEffect(() => {
    if (isAttendanceSheetError) {
      toast.error(`Failed to download attendance sheet: ${attendanceSheetError?.message}`, {
        autoClose: 5000,
      });
      setDownloadDocumentId(null); // Reset the document ID
    }
  }, [isAttendanceSheetError, attendanceSheetError]);
  if (isLoading) {
    return (
      <MDBox
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
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
      start_date: moment(classroom.created_at).format("DD/MM/YY HH:mm"),
    }));

  // Columns configuration
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
        <MDButton
          variant="outlined"
          color="primary"
          onClick={() => handleSession(params.row)}
          disabled={params.row.is_assesment === "Without Assessment"} // Disable if 'is_assesment' is 'With Assessment'
        >
          Start Session
        </MDButton>
      ),
    },
    ...(groupId === 7
      ? [
          {
            field: "question",
            headerName: "Question",
            flex: 1,
            headerAlign: "center",
            renderCell: (params) => (
              <MDButton
                variant="outlined"
                color="info"
                onClick={() => navigate("/class-question", { state: { classroom: params.row } })}
                disabled={params.row.is_assesment === "Without Assessment"} // Disable if 'is_assesment' is 'With Assessment'
              >
                Questions
              </MDButton>
            ),
          },
        ]
      : []),
    ...(groupId === 7
      ? [
          {
            field: "quiz",
            headerName: "Quiz",
            flex: 1,
            headerAlign: "center",
            renderCell: (params) => (
              <MDButton
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/class-quiz", { state: { classroom: params.row } })}
                disabled={params.row.is_assesment === "Without Assessment"} // Disable if 'is_assesment' is 'With Assessment'
              >
                Quiz
              </MDButton>
            ),
          },
        ]
      : []),
      {
        field: "assessment",
        headerName: "Assessment",
        flex: 1,
        headerAlign: "center",
        renderCell: (params) => (
          <MDButton
            variant="outlined"
            color="warning"
            onClick={() => handleAssessmentClick(params.row)}
            disabled={params.row.is_assessment_completed} // Disable if 'is_assessment_completed' is true or 'is_assesment' is 'Without Assessment'
          >
            Assessment
          </MDButton>
        ),
      },
      ...(groupId === 7
        ? [
          {
        field: "attendance",
        headerName: "Attendance",
        flex: 1,
        headerAlign: "center",
        renderCell: (params) => (
          <MDButton
            variant="outlined"
            color="success"
            onClick={() => handleDownloadAttendanceSheet(params.row.document)}
            // disabled={params.row.is_assesment === "Without Assessment"} // Disable if 'is_assesment' is 'Without Assessment'
          >
            Attendance Sheet
          </MDButton>
        ),
      },
    ]
    : []),
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

  const getRowId = (row) => {
    if (row.classroom_name && row.created_at) {
      return `${row.classroom_name}-${row.created_at}`;
    } else {
      return row.serial_number || Date.now();
    }
  };

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
              getRowId={getRowId} // Specify how to get the row's unique id
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
