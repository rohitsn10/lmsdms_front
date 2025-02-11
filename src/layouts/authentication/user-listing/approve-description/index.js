import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MDButton from "components/MDButton";
import { TextField } from "@mui/material"; // Import the TextField component
import { useGetJobDescriptionListQuery, useHodRemarksMutation } from "apilms/jobRoleApi"; // Import the new hook
import { toast } from "react-toastify"; // Import toast for notifications

const TaskDescriptionDialog = ({ open, onClose, userId, onSave }) => {
  const [taskDescription, setTaskDescription] = useState("");
  const [remark, setRemark] = useState(""); // State for remark
  const [hodRemarks, { isLoading, isError, error }] = useHodRemarksMutation(); // Mutation hook for HOD remarks

  // Fetch job description list for the given userId
  const { data, isLoading: isDataLoading, isError: isDataError, error: dataError } = useGetJobDescriptionListQuery(userId);

  // Set task description and user id when data is fetched
  const [currentUserId, setCurrentUserId] = useState(null); // State for storing the current user id

  useEffect(() => {
    if (data && data.data && data.data.length > 0) {
      setTaskDescription(data.data[0].employee_job_description); // Get the first job description
      setCurrentUserId(data.data[0].id); // Extract and set the user id from the API response
    }
  }, [data]);

  const handleSave = async (status) => {
    // Ensure we have the current user id
    if (currentUserId) {
      try {
        // Call HOD remarks mutation with the current user_id, status, and remark
        await hodRemarks({ user_id: currentUserId, status, remark }).unwrap(); // Trigger HOD remarks mutation
        
        // Show success toast notification
        toast.success(`Job description ${status === "approve" ? "approved" : "sent back"} successfully!`);
        
        onClose(); // Close the dialog after saving
      } catch (error) {
        // Show error toast notification
        toast.error(`Error saving HOD remarks: ${error.message || error}`);
      }
    } else {
      console.error("User ID is missing.");
    }
  };

  if (isDataLoading) return <div>Loading...</div>;
  if (isDataError) return <div>Error fetching job description: {dataError?.message}</div>;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ borderRadius: 2 }}>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.25rem", color: "#333" }}>
        Job Description
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            minHeight: "150px",
            whiteSpace: "pre-line", // To preserve newlines
          }}
        >
          {taskDescription || "No job description available."} {/* Show the description */}
        </div>

        {/* Text Field for Add Remark */}
        <TextField
          label="Add Remark"
          value={remark}
          onChange={(e) => setRemark(e.target.value)} // Update the remark state
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ marginTop: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <MDButton onClick={onClose} color="secondary" sx={{ textTransform: "none", padding: "8px 20px" }}>
          Cancel
        </MDButton>
        <MDButton
          onClick={() => handleSave("send_back")}
          color="warning"
          sx={{
            textTransform: "none",
            backgroundColor: "#ff9800", // Orange color for send back
            "&:hover": {
              backgroundColor: "#f57c00", // Darker orange on hover
            },
            padding: "8px 20px",
          }}
        >
          Send Back
        </MDButton>
        <MDButton
          onClick={() => handleSave("approve")}
          color="success"
          sx={{
            textTransform: "none",
            backgroundColor: "#4caf50", // Green color for approve
            "&:hover": {
              backgroundColor: "#388e3c", // Darker green on hover
            },
            padding: "8px 20px",
          }}
        >
          Approve
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

// PropTypes validation
TaskDescriptionDialog.propTypes = {
  open: PropTypes.bool.isRequired,           // expects a boolean, is required
  onClose: PropTypes.func.isRequired,        // expects a function, is required
  onSave: PropTypes.func.isRequired,         // expects a function, is required
  userId: PropTypes.string.isRequired,       // expects a string, is required
};

export default TaskDescriptionDialog;
