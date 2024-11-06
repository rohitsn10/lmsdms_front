import React, { useState } from "react";
import PropTypes from "prop-types";
import { useCreateStatusMutation } from "api/auth/statusApi"; // Assuming the statusApi is placed in services folder
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField, Button } from "@mui/material";

function AddStatusDialog({ open, handleClose }) {
  const [status, setStatus] = useState("");
  const [createStatus, { isLoading, isSuccess, isError, error }] = useCreateStatusMutation();

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubmit = async () => {
    if (status) {
      try {
        // Call the API to create a new status
        await createStatus(status).unwrap();
        handleClose(); // Close dialog after successful submission
      } catch (err) {
        console.error("Failed to create status:", err);
        // Handle errors, e.g., show a toast notification or an error message
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Status</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <TextField
            label="Status"
            variant="outlined"
            value={status}
            onChange={handleStatusChange}
            fullWidth
            sx={{ minWidth: 200, height: "3rem" }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddStatusDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddStatusDialog;
