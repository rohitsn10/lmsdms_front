import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  TextField,
} from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import React, { useState } from "react";
import MDTypography from "components/MDTypography";
import { usePrintApprovalsMutation } from "api/auth/printApi";

const ApprovalDialog = ({ open, onClose, maxCopies, requestId }) => {
  const [numberOfCopies, setNumberOfCopies] = useState("");
  const [isInvalid, setIsInvalid] = useState(false); // Track if the input is invalid
  const [printApprovals, { isLoading: isSubmitting }] = usePrintApprovalsMutation();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isInvalid) return; // Prevent submission if invalid

    printApprovals({
      print_request_id: requestId,
      no_of_request_by_admin: numberOfCopies,
      status: "9",
    })
      .then((response) => {
        console.log("Print approval response:", response);
        onClose();
      })
      .catch((err) => {
        console.error("Error in print approval:", err);
      });
  };

  const handleReject = () => {
    // Implement reject logic
    console.log("Request rejected:", requestId);
    onClose();
  };

  const handleClear = () => {
    setNumberOfCopies("");
    setIsInvalid(false);
  };

  const handleChange = (e) => {
    const value = Number(e.target.value);
    if (value > maxCopies) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
    setNumberOfCopies(value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <MDBox sx={{ textAlign: "center" }}>
        <MDTypography variant="h4" fontWeight="medium" color="#344767" mt={1}>
          Add Approval
        </MDTypography>
      </MDBox>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <MDBox display="flex" justifyContent="flex-end">
            <MDButton
              variant="outlined"
              color="error"
              size="small"
              onClick={handleClear}
              sx={{ marginRight: "20px" }}
            >
              Clear
            </MDButton>
          </MDBox>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Number of Copies"
              type="number"
              value={numberOfCopies}
              onChange={handleChange}
              helperText={
                isInvalid
                  ? `Value cannot exceed ${maxCopies}`
                  : `Maximum copies allowed: ${maxCopies}`
              }
              error={isInvalid} // Highlight the field in red if invalid
              fullWidth
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={onClose} color="error" sx={{ marginRight: "10px" }}>
            Cancel
          </MDButton>
          <MDButton
            variant="gradient"
            color="error"
            fullWidth
            disabled={isInvalid || isSubmitting} // Disable if invalid
            onClick={handleReject}
          >
            Reject
          </MDButton>
          <MDButton
            variant="gradient"
            color="success"
            fullWidth
            type="submit"
            disabled={isInvalid || isSubmitting} // Disable if invalid
          >
            {isSubmitting ? "Submitting..." : "Approve"}
          </MDButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

ApprovalDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  maxCopies: PropTypes.number.isRequired,
  requestId: PropTypes.number.isRequired,
};

export default ApprovalDialog;
