import React from "react";
import PropTypes from "prop-types"; 
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useDocumentreleaseEffectiveStatusMutation } from "api/auth/texteditorApi"; // import the API hook

const ConditionalDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  trainingStatus, 
  documentId 
}) => {
  // Destructure the mutation hook
  const [documentReleaseEffectiveStatus] = useDocumentreleaseEffectiveStatusMutation();

  const heading =
    trainingStatus === "true"
      ? "Are you sure effective?"
      : "Are you sure you want to release the document?";

  const handleConfirm = async () => {
    const status = trainingStatus === "true" ? 6 : 7; // Use "6" if true, otherwise "7"
    console.log("Document ID:----------------", documentId);
    console.log("Training Status:-----------------", trainingStatus);

    try {
      // Call the mutation API with the documentId and status
      await documentReleaseEffectiveStatus({ document_id: documentId, status_id: status });
      onConfirm(); // Trigger the onConfirm callback if needed
    } catch (error) {
      console.error("Error submitting the document release:", error);
    }

    onClose(); // Close the dialog after submission
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
              onClick={handleConfirm} // Trigger handleConfirm on Submit
            >
              Submit
            </MDButton>
          </MDBox>
        </DialogActions>
      </form>
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
