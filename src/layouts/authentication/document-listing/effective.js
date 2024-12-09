import React from "react";
import PropTypes from "prop-types"; 
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useDocumentDocadminStatusMutation } from "api/auth/texteditorApi";

const ConditionalDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  trainingStatus, 
  documentId 
}) => {
  const heading =
    trainingStatus === "false"
      ? "Are you sure effective?"
      : "Are you sure you want to release the document?";

  const [documentDocadminStatus, { isLoading, isError, error }] = useDocumentDocadminStatusMutation();

  const handleConfirm = async () => {
    try {
      console.log("Document ID In Effective :", documentId);
  
      // Create a FormData object and append documentId and status
      const formData = new FormData();
      formData.append("document_id", documentId);
      formData.append("status", "approved");  // or use the relevant status value
  
      // Call the mutation with FormData
      await documentDocadminStatus(formData);
      
      onConfirm();
      onClose(); 
    } catch (err) {
      console.error("Error updating document status:", err);
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <MDBox sx={{ textAlign: "center" }}>
        <MDTypography variant="h4" fontWeight="medium" color="#344767" mt={1}>
          {heading}
        </MDTypography>
      </MDBox>

      <form onSubmit={(e) => e.preventDefault()}>
        <DialogContent>
          <MDBox sx={{ marginTop: 2, textAlign: "center" }}>
            <MDTypography variant="body1" color="#344767">
              Please confirm your action.
            </MDTypography>
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
              onClick={handleConfirm}
              disabled={isLoading} 
            >
              {isLoading ? "Submitting..." : "Submit"}
            </MDButton>
          </MDBox>
        </DialogActions>
      </form>

      {/* Optionally display error message if mutation fails */}
      {isError && (
        <MDBox sx={{ textAlign: "center", mt: 2 }}>
          <MDTypography variant="body2" color="error">
            Error: {error.message}
          </MDTypography>
        </MDBox>
      )}
    </Dialog>
  );
};

ConditionalDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  trainingStatus: PropTypes.string.isRequired, 
  documentId: PropTypes.string.isRequired, 
};

export default ConditionalDialog;
