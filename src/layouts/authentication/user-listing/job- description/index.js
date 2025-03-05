import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import MDButton from "components/MDButton";
import { useCreateJobDescriptionMutation } from "apilms/jobRoleApi"; // Import the mutation hook
import { toast } from "react-toastify"; // Import toast

const JobDescriptionDialog = ({ open, onClose, userId }) => {
  const [jobDescription, setJobDescription] = useState("");

  // Hook to create a job description
  const [createJobDescription, { isLoading, isError }] = useCreateJobDescriptionMutation();

  const handleChange = (event) => setJobDescription(event.target.value);

  const handleSave = async () => {
    if (jobDescription.trim()) {
      try {
        // Call the mutation to create the job description
        await createJobDescription({ user_id: userId, employee_job_description: jobDescription }).unwrap();
        
        // Show success toast notification
        toast.success("Job description assigned successfully!");

        onClose(); // Close dialog after successful save
      } catch (error) {
        // console.error("Error creating job description:", error);

        // Show error toast notification
        toast.error("Failed to save job description. Please try again.");
      }
    } else {
      toast.warning("Please enter a job description.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ borderRadius: 2 }}>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.25rem", color: "#333" }}>
        Assign Job Description
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Job Description"
          type="text"
          fullWidth
          value={jobDescription}
          onChange={handleChange}
          required
          multiline
          rows={4} // Makes the input field larger and multiline for better UX
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
              '& fieldset': {
                borderColor: '#ccc', // Adjusting the border color
              },
            },
            '& .MuiInputLabel-root': {
              fontWeight: 'bold', // More prominent label
            },
            '& .MuiInputBase-input': {
              fontSize: '1rem', // Slightly larger text for readability
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <MDButton onClick={onClose} color="secondary" sx={{ textTransform: 'none' }}>
          Cancel
        </MDButton>
        <MDButton
          onClick={handleSave}
          color="primary"
          sx={{
            textTransform: 'none',
            backgroundColor: "#1976d2",
            '&:hover': {
              backgroundColor: "#1565c0", // Darker blue on hover
            },
            padding: '8px 20px', // Padding for buttons
          }}
          disabled={isLoading} // Disable the button when the mutation is loading
        >
          {isLoading ? 'Saving...' : 'Save'}
        </MDButton>
      </DialogActions>
      {isError && <div style={{ color: "red", padding: "10px", textAlign: "center" }}>Failed to save job description.</div>}
    </Dialog>
  );
};

JobDescriptionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default JobDescriptionDialog;
