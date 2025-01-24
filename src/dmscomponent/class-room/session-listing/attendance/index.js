import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types"; // Import PropTypes for validation
import { useCreateAttendanceMutation } from "apilms/classRoomApi"; // Import the mutation hook

const AttendanceDialog = ({ open, setOpen, attendanceData, setAttendanceData, sessionId,refetch  }) => {
  // console.log("AttendanceDialog open-------------:", open); 
  const [createAttendance] = useCreateAttendanceMutation(); // Hook to call the mutation

  // Handle attendance change (checkbox toggle)
  const handleAttendanceChange = (index, event) => {
    const updatedAttendance = attendanceData.map((user, idx) => {
      if (idx === index) {
        return { ...user, present: event.target.checked }; // Update present status
      }
      return user;
    });

    setAttendanceData(updatedAttendance); // Update the state
  };

  // Handle saving attendance
  const handleSaveAttendance = () => {
    // Collect user IDs and their status from the attendanceData state
    const userIds = attendanceData
      .filter(user => user.present !== undefined) // Filter out users with undefined status
      .map(user => user.id); // Get only user IDs

    // const statuses = attendanceData
    //   .filter(user => user.present !== undefined) // Filter out users with undefined status
    //   .map(user => user.present ? 'present' : 'absent'); // Convert present status to 'present' or 'absent'

    if (userIds.length > 0) {
      // Create an object with the session ID, user IDs, and statuses
      const attendanceDataToSend = {
        session_id: sessionId,  // Use the session ID from the current session
        user_ids: userIds,      // Send the user IDs
        status:  "present",       // Send the statuses (present/absent)
      };

      // Call the API to save the attendance
      createAttendance(attendanceDataToSend)
        .unwrap()
        .then((response) => {
          console.log("Attendance marked:", response);
          setOpen(false); // Close the dialog after saving
          refetch(); 
        })
        .catch((error) => {
          console.error("Error saving attendance:", error);
        });
       
    }
  };
  const handleCloseDialog = () => {
    setOpen(false); // Close dialog
    refetch(); // Trigger refetch to refresh session data
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Attendance</DialogTitle>
      <DialogContent>
        {attendanceData?.length > 0 ? (
          attendanceData.map((user, index) => (
            <FormControlLabel
              key={user.id}
              control={
                <Checkbox
                  checked={attendanceData[index]?.present || false}
                  onChange={(e) => handleAttendanceChange(index, e)} 
                  name={user.username}
                />
              }
              label={user.username}
            />
          ))
        ) : (
          <MDTypography variant="body1" align="center">
            No users available for this session.
          </MDTypography>
        )}
      </DialogContent>
      <DialogActions>
      <MDButton onClick={handleCloseDialog} color="secondary">
          Close
        </MDButton>
        <MDButton onClick={handleSaveAttendance} color="primary">
          Save
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

// PropTypes validation
AttendanceDialog.propTypes = {
  open: PropTypes.bool.isRequired, // open is a boolean, and it's required
  setOpen: PropTypes.func.isRequired, // setOpen is a function, and it's required
  attendanceData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
      present: PropTypes.bool,
    })
  ).isRequired, // attendanceData is an array of objects, each with id, username, and present (boolean)
  setAttendanceData: PropTypes.func.isRequired, // setAttendanceData is a function, and it's required
  sessionId: PropTypes.number.isRequired, // sessionId is a number and required
  refetch:PropTypes.func.isRequired,
  
};

export default AttendanceDialog;
