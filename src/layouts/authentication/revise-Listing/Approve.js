import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const ReviseApproveDialog = ({
  open,
  onClose,
  onApprove,
  onReject,
  reason: initialReason, // Pre-filled reason from the listing
}) => {
  const [reason, setReason] = useState(initialReason || "");

  // Log the props to check the data being passed
  useEffect(() => {
    console.log("ReviseApproveDialog opened with data:", { open, initialReason });
  }, [open, initialReason]);

  const handleApprove = () => {
    // Trigger the approve callback with reason if needed
    onApprove(reason);
    onClose();
  };

  const handleReject = () => {
    // Trigger the reject callback with reason if needed
    onReject(reason);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <MDBox sx={{ textAlign: "center" }}>
        <MDTypography variant="h4" fontWeight="medium" color="#344767" mt={1}>
          Revise Approve
        </MDTypography>
      </MDBox>

      <form onSubmit={(e) => e.preventDefault()}>
        <DialogContent>
          <MDBox sx={{ marginTop: 2, textAlign: "center" }}>
            <TextField
              fullWidth
              label="Reason"
              variant="outlined"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              multiline
              rows={3}
              required
            />
          </MDBox>
        </DialogContent>

        <DialogActions>
          <MDButton onClick={onClose} color="error" sx={{ marginRight: "10px" }}>
            Cancel
          </MDButton>
          <MDBox sx={{ display: "flex", gap: 2 }}>
            <MDButton
              variant="gradient"
              color="success"
              onClick={handleApprove} // Trigger approve action
            >
              Approve
            </MDButton>

            <MDButton
              variant="gradient"
              color="warning"
              onClick={handleReject} // Trigger reject action
            >
              Reject
            </MDButton>
          </MDBox>
        </DialogActions>
      </form>
    </Dialog>
  );
};

ReviseApproveDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  reason: PropTypes.string, // Pre-filled reason passed from parent (optional)
};

export default ReviseApproveDialog;
