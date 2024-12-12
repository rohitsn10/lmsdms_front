import React, { useState } from "react";
import PropTypes from "prop-types"; 
import { Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useReviseRequestMutation } from "api/auth/documentApi"; // Import the API hook

const ReviseDialog = ({
  open,
  onClose,
  onConfirm,
  documentId, // only keep documentId
}) => {
  const [reason, setReason] = useState(""); // state for reason
  const [reviseRequest, { isLoading, isError, isSuccess, error }] = useReviseRequestMutation(); // Using the mutation hook

  const handleConfirm = async () => {
    try {
      // Call the API mutation
      await reviseRequest({ document_id: documentId, revise_description: reason }).unwrap();
      
      // Trigger the onConfirm callback if needed
      onConfirm(reason);

      onClose(); // Close the dialog after submission
    } catch (err) {
      // Handle any errors during the API call
      console.error("Error submitting revision:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <MDBox sx={{ textAlign: "center" }}>
        <MDTypography variant="h4" fontWeight="medium" color="#344767" mt={1}>
          Reason For Revise
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
          <MDBox>
            <MDButton
              variant="gradient"
              color="submit"
              fullWidth
              onClick={handleConfirm} // Trigger handleConfirm on Submit
              disabled={isLoading || !reason.trim()} // Disable submit if reason is empty or request is in progress
            >
              {isLoading ? "Submitting..." : "Submit"} {/* Show loading text while submitting */}
            </MDButton>
          </MDBox>
        </DialogActions>
      </form>

      {/* Optional: Show error message if the mutation fails */}
      {isError && (
        <MDBox sx={{ textAlign: "center", color: "red", mt: 2 }}>
          <MDTypography variant="body2">Error: {error.message}</MDTypography>
        </MDBox>
      )}

      {/* Optional: Show success message if the mutation succeeds */}
      {isSuccess && (
        <MDBox sx={{ textAlign: "center", color: "green", mt: 2 }}>
          <MDTypography variant="body2">Revision submitted successfully!</MDTypography>
        </MDBox>
      )}
    </Dialog>
  );
};

ReviseDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  documentId: PropTypes.string.isRequired, // Document ID passed from parent
};

export default ReviseDialog;
