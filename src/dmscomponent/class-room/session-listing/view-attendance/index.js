import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types"; // Import PropTypes for validation

const ViewAttendanceDialog = ({ open, setOpen, attendanceData }) => {
  // Mock data, you can replace this with actual data when available
  const mockAttendanceData = [
    { id: 1, username: "John Doe", present: true },
    { id: 2, username: "Jane Smith", present: false },
    { id: 3, username: "Tom Brown", present: true },
    { id: 4, username: "Lisa White", present: false },
  ];

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>View Attendance</DialogTitle>
      <DialogContent>
        {mockAttendanceData?.length > 0 ? (
          mockAttendanceData.map((user) => (
            <div
              key={user.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                color: user.present ? "#4caf50" : "#f44336", // green for present, red for absent
              }}
            >
              {/* Display a colored circle indicator */}
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: user.present ? "#4caf50" : "#f44336", // green or red
                  marginRight: "10px",
                }}
              ></div>
              {/* Display the username */}
              <MDTypography variant="body1" style={{ flex: 1 }}>
                {user.username}
              </MDTypography>
              {/* Show a checkmark or cross icon based on the attendance status */}
              {user.present ? (
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
  attendanceData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
      present: PropTypes.bool,
    })
  ).isRequired, // attendanceData is an array of objects, each with id, username, and present (boolean)
};

export default ViewAttendanceDialog;