import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import { useUpdateStatusMutation } from 'api/auth/statusApi';  // Import the update status mutation

const UpdateStatusDialog = ({ open, handleClose, statusId, statusText }) => {
  const [status, setStatus] = useState(statusText);  // Local state for status input

  const [updateStatus] = useUpdateStatusMutation();  // Hook to call the update status API

  useEffect(() => {
    setStatus(statusText);  // Update the status input when the dialog opens
  }, [statusText]);

  const handleUpdate = async () => {
    if (status.trim()) {
      try {
        const response = await updateStatus({ id: statusId, status }).unwrap();
        if (response.status) {
          handleClose();  // Close dialog after successful update
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

export default UpdateStatusDialog;
