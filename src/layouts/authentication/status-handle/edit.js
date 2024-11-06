import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MDInput from 'components/MDInput';
import PropTypes from "prop-types";
import MDButton from 'components/MDButton';
import { useUpdateStatusMutation } from 'api/auth/statusApi';

const UpdateStatusDialog = ({ open, handleClose, statusId, statusText }) => {
  const [status, setStatus] = useState(statusText);

  const [updateStatus] = useUpdateStatusMutation();

  useEffect(() => {
    setStatus(statusText);
  }, [statusText]);

  const handleUpdate = async () => {
    if (status.trim()) {
      try {
        const response = await updateStatus({ id: statusId, status }).unwrap();
        if (response.status) {
          handleClose();
        } else {
          console.error('Error updating status:', response.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Status</DialogTitle>
      <DialogContent>
        <MDInput
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <MDButton onClick={handleClose} color="primary">
          Cancel
        </MDButton>
        <MDButton onClick={handleUpdate} color="primary">
          Update
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

// Define PropTypes for the component
UpdateStatusDialog.propTypes = {
  open: PropTypes.bool.isRequired,           // Boolean to indicate if dialog is open
  handleClose: PropTypes.func.isRequired,    // Function to close the dialog
  statusId: PropTypes.string.isRequired,     // String identifier for the status
  statusText: PropTypes.string.isRequired    // Initial status text for the input
};

export default UpdateStatusDialog;