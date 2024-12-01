import React from "react";
import PropTypes from "prop-types"; 
import {
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const ConditionalDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  trainingStatus 
}) => {
  const heading =
    trainingStatus === "yes"
      ? "Are you sure effective?"
      : "Are you sure you want to release the document?";

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
            <MDButton variant="gradient" color="submit" fullWidth onClick={onConfirm}>
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
};

export default ConditionalDialog;
