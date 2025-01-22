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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const SessionListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openAttendanceDialog, setOpenAttendanceDialog] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const navigate = useNavigate();

  // Static session data
  const sessions = [
    {
      id: 1,
      session_name: "React Basics",
      venue: "Room A",
      date_time: "2025-02-01T09:00:00Z",
      status: "Scheduled",
      attendees: [
        { name: "John Doe", present: false },
        { name: "Jane Smith", present: true },
        { name: "Sam Wilson", present: false },
      ],
    },
    {
      id: 2,
      session_name: "Advanced JavaScript",
      venue: "Room B",
      date_time: "2025-02-02T10:00:00Z",
      status: "Scheduled",
      attendees: [
        { name: "Alice Cooper", present: true },
        { name: "Bob Brown", present: true },
      ],
    },
    // Add more sessions as needed
  ];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditSession = (session) => {
    navigate("/edit-session", { state: { session } });
  };

  const handleAttendanceClick = (session) => {
    setAttendanceData(session.attendees);
    setOpenAttendanceDialog(true);
  };

  const handleAttendanceChange = (index, event) => {
    const updatedAttendance = [...attendanceData];
    updatedAttendance[index].present = event.target.checked;
    setAttendanceData(updatedAttendance);
  };

  const handleSaveAttendance = () => {
    console.log("Updated Attendance:", attendanceData);
    setOpenAttendanceDialog(false);
  };

  // Filter session data based on search term
  const filteredData = sessions
    .filter(
      (session) =>
        session.session_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.venue.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((session, index) => ({
      ...session,
      serial_number: index + 1,
      start_date: moment(session.date_time).format("DD/MM/YY HH:mm"),
    }));

  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "session_name", headerName: "Session Name", flex: 1, headerAlign: "center" },
    { field: "venue", headerName: "Venue", flex: 1, headerAlign: "center" },
    { field: "start_date", headerName: "Date & Time", flex: 1, headerAlign: "center" },
    { field: "status", headerName: "Status", flex: 1, headerAlign: "center" },
    {
      field: "attendance",
      headerName: "Attendance",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <MDButton variant="outlined" color="primary" onClick={() => handleAttendanceClick(params.row)}>
          View Attendance
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
            onClick={() => navigate("/add-session")}
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

      {/* Attendance Dialog */}
      <Dialog open={openAttendanceDialog} onClose={() => setOpenAttendanceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Attendance</DialogTitle>
        <DialogContent>
          {attendanceData.map((attendee, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={attendee.present}
                  onChange={(e) => handleAttendanceChange(index, e)}
                  name={attendee.name}
                />
              }
              label={attendee.name}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setOpenAttendanceDialog(false)} color="secondary">
            Close
          </MDButton>
          <MDButton onClick={handleSaveAttendance} color="primary">
            Save
          </MDButton>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
};

export default SessionListing;
