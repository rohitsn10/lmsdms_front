import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetSessionsQuery, useMarkSessionCompletedMutation } from "apilms/classRoomApi";
import { useUserListQuery } from "api/auth/userApi";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import moment from "moment";
import AttendanceDialog from "./attendance/index";
import ViewAttendanceDialog from "./view-attendance";
const SessionListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [openAttendanceDialog, setOpenAttendanceDialog] = useState(false);
  console.log("----------------------------",openAttendanceDialog)
  const [selectedSessionId, setSelectedSessionId] = useState(null); // Track selected session ID
  const navigate = useNavigate();
  const location = useLocation();
  const classroom = location.state?.classroom;
  const classroomId = classroom.classroom_id;
  const [markSessionCompleted] = useMarkSessionCompletedMutation();
  const { data, isLoading, error } = useGetSessionsQuery(classroomId);
  const { data: userData, isLoading: isUserLoading, error: userError } = useUserListQuery();
  const [openViewAttendanceDialog, setOpenViewAttendanceDialog] = useState(false);
  const [viewAttendanceData, setViewAttendanceData] = useState([]);
  // console.log(data?.data)
  const handleSearch = (event) => setSearchTerm(event.target.value);

  // Edit session handler
  const handleEditSession = (session) => navigate("/edit-session", { state: { session } });

  const handleAttendanceClick = (sessionId, isViewAttendance = false) => {
    // console.log("handleAttendanceClick called for sessionId:", sessionId);  // Add this line
    console.log("Click")
    console.log("SessionID",sessionId)
    console.log("View Attendance.",isViewAttendance)
    console.log(data)
    setSelectedSessionId(sessionId); // Set the selected session ID
    console.log("Selected sessionId",selectedSessionId);
    const session = data?.data?.find((s) => s.session_id === sessionId);
    console.log(session);
    if (session && session.user_ids) {
      const userIds = session.user_ids;
      const filteredUsers = userData?.data?.filter((user) => userIds.includes(user.id));
  
      if (isViewAttendance) {
        // Open View Attendance Dialog
        setViewAttendanceData(filteredUsers);
        setOpenViewAttendanceDialog(true);
      } else {
        // Open Attendance Dialog
        setAttendanceData(filteredUsers);
        setOpenAttendanceDialog(true);
        console.log("Dialog open state:", openAttendanceDialog); 
      }
    }
  };
  

  // Mark session as completed
  const handleMarkCompleted = (sessionId) => {
    markSessionCompleted(sessionId)
      .unwrap()
      .then((response) => console.log("Session marked as completed:", response))
      .catch((err) => console.error("Failed to mark session as completed:", err));
  };

  // Filtered session data for search
  const filteredData = data?.data
    ? data.data
        .filter(
          (session) =>
            session.session_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.venue.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((session, index) => ({
          ...session,
          id: session.session_id, // Use session_id as the unique id
          serial_number: index + 1, // Add serial number (index + 1)
          start_date: moment(session.start_date).format("DD/MM/YY HH:mm"), // Format start date
        }))
    : [];

    const handleNewAttendance =()=>{
      console.log("New Toggle")
    }
  
  // Columns for the data grid
  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "session_name", headerName: "Session Name", flex: 1, headerAlign: "center" },
    { field: "venue", headerName: "Venue", flex: 1, headerAlign: "center" },
    { field: "start_date", headerName: "Date & Time", flex: 1, headerAlign: "center" },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <MDButton
          variant="outlined"
          color={params.row.is_completed ? "success" : "error"}
          onClick={() => {
            if (!params.row.is_completed) handleMarkCompleted(params.row.id);
          }}
        >
          {params.row.is_completed ? "Completed" : "Pending"}
        </MDButton>
      ),
    },
    {
      field: "attendance",
      headerName: "Attendance",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <MDButton
          variant="outlined"
          color="primary"
          onClick={()=>{
            handleNewAttendance();
              const isViewAttendance = params.row.attend;
              console.log("View Attendance",isViewAttendance)
              console.log(params.row.id);
              handleAttendanceClick(params.row.id,isViewAttendance)
          }}
          // onClick={() => {
          //   const isViewAttendance = params.row.attend; // Check if attendance is available to view
          //   console.log("View Attendance",isViewAttendance);
          //   handleAttendanceClick(params.row.id, isViewAttendance); // Pass isViewAttendance flag
          // }}
          disabled={!params.row.is_completed}
        >
          {params.row.attend ? "View Attendance" : "Mark Attendance"}
        </MDButton>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleEditSession(params.row)}>
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
            Session Listing
          </MDTypography>
          <MDButton
            variant="contained"
            color="primary"
            onClick={() => navigate("/add-session", { state: { classroomId } })}
            sx={{ ml: 2 }}
          >
            Add Session
          </MDButton>
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={filteredData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              getRowId={(row) => row.session_id} // Specify session_id as the unique id
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

      {/* Attendance Dialog */}
      <AttendanceDialog
        open={openAttendanceDialog}
        setOpen={setOpenAttendanceDialog}
        attendanceData={attendanceData}
        setAttendanceData={setAttendanceData}
        sessionId={selectedSessionId} // Pass sessionId to the dialog
      />
      <ViewAttendanceDialog
        open={openViewAttendanceDialog}
        setOpen={setOpenViewAttendanceDialog}
        attendanceData={viewAttendanceData}
      />
    </MDBox>
  );
};

export default SessionListing;