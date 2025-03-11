import React from "react";
import PropTypes from "prop-types";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useDocumentreleaseEffectiveStatusMutation } from "api/auth/texteditorApi"; // import the API hook
import { useFetchDocumentsQuery } from "api/auth/documentApi";
import { toast } from "react-toastify";

const ConditionalDialog = ({
  open,
  onClose,
  onConfirm,
  trainingStatus,
  documentId,
  revisionMonth,
}) => {
  // Destructure the mutation hook
  const [documentReleaseEffectiveStatus] = useDocumentreleaseEffectiveStatusMutation();
  const { refetch } = useFetchDocumentsQuery();

  const heading =
    trainingStatus === true
      ? "Are you sure you want to release the document?"
      : "Are you sure you want to effective the document?";

  const handleConfirm = async () => {
    const status = trainingStatus === true ? 6 : 7; 
    const currentDate = new Date();
    const effectiveDate = `${currentDate.getDate().toString().padStart(2, "0")}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${currentDate.getFullYear()}`;

    let revisionDate = ""; 
    if (revisionMonth && revisionMonth !== "0") {
      const [day, month, year] = effectiveDate.split("-").map(Number);
      const effectiveDateObj = new Date(year, month - 1, day);
      const revisionYear = effectiveDateObj.getFullYear() + 1;
      const revisionDateObj = new Date(revisionYear, parseInt(revisionMonth, 10) - 1, day);
      if (revisionDateObj.getMonth() !== parseInt(revisionMonth, 10) - 1) {
        revisionDateObj.setDate(0); 
      }
      revisionDate = `${revisionDateObj.getDate().toString().padStart(2, "0")}-${(
        revisionDateObj.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${revisionDateObj.getFullYear()}`;
    }
    try {
      await documentReleaseEffectiveStatus({
        document_id: documentId,
        status_id: status,
        ...(status === 7 && { effective_date: effectiveDate }),
        ...(status === 7 && effectiveDate && { revision_date: revisionDate }),
      });
      refetch();
      toast.success("Document release successful!", ); 
    } catch (error) {
      console.error("Error submitting the document release:", error);
      toast.error("Failed to release document. Please try again.");
    }
    onClose(); 
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
  revisionMonth: PropTypes.string, // Update PropTypes to include revisionMonth
  
};

export default ConditionalDialog;
