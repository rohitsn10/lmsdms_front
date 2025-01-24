import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types"; // Import PropTypes for validation
import { useGetAttendanceQuery } from "apilms/classRoomApi"; // Import the hook for API call

const ViewAttendanceDialog = ({ open, setOpen, sessionId }) => {
  const { data: attendanceData, isLoading, error } = useGetAttendanceQuery(sessionId, {
    skip: !sessionId, // Skip the query if no sessionId is provided
  });

  useEffect(() => {
    if (!sessionId) {
      setOpen(false); // Close the dialog if no sessionId is provided
    }
  }, [sessionId, setOpen]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>View Attendance</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <MDTypography variant="body1" align="center">
            Loading attendance data...
          </MDTypography>
        ) : error ? (
          <MDTypography variant="body1" align="center" color="error">
            Error loading attendance data.
          </MDTypography>
        ) : attendanceData && attendanceData.length > 0 ? (
          attendanceData.map((user) => (
            <div
              key={user.user_id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                color: user.status.toLowerCase() === "present" ? "#4caf50" : "#f44336", // green for present, red for absent
              }}
            >
              {/* Display a colored circle indicator */}
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: user.status.toLowerCase() === "present" ? "#4caf50" : "#f44336", // green or red
                  marginRight: "10px",
                }}
              ></div>
              {/* Display the username */}
              <MDTypography variant="body1" style={{ flex: 1 }}>
                {user.user_name}
              </MDTypography>
              {/* Show a checkmark or cross icon based on the attendance status */}
              {user.status.toLowerCase() === "present" ? (
                <span style={{ fontSize: "18px", color: "#4caf50" }}>✔</span>
              ) : (
                <span style={{ fontSize: "18px", color: "#f44336" }}>✘</span>
              )}
            </div>
          ))
        ) : (
          <MDTypography variant="body1" align="center">
            No attendance data available.
          </MDTypography>
        )}
      </DialogContent>
      <DialogActions>
        <MDButton onClick={() => setOpen(false)} color="secondary">
          Close
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

// PropTypes validation
ViewAttendanceDialog.propTypes = {
  open: PropTypes.bool.isRequired, // open is a boolean, and it's required
  setOpen: PropTypes.func.isRequired, // setOpen is a function, and it's required
  sessionId: PropTypes.number.isRequired, // sessionId is required for fetching attendance
};

export default ViewAttendanceDialog;
