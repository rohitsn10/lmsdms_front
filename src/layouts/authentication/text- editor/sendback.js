import React from "react";
import PropTypes from "prop-types"; // Correctly imported
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";

const SendBackDialog = ({
  open,
  onClose,
  onConfirm,
  assignedTo,
  setAssignedTo,
  statusSendBack,
  setStatusSendBack,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Send Back</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Assigned To</InputLabel>
          <Select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <MenuItem value="user1">User 1</MenuItem>
            <MenuItem value="user2">User 2</MenuItem>
            <MenuItem value="user3">User 3</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Status Send Back</InputLabel>
          <Select
            value={statusSendBack}
            onChange={(e) => setStatusSendBack(e.target.value)}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="review">Review</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SendBackDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  assignedTo: PropTypes.string,
  setAssignedTo: PropTypes.func.isRequired,
  statusSendBack: PropTypes.string,
  setStatusSendBack: PropTypes.func.isRequired,
};

export default SendBackDialog;
