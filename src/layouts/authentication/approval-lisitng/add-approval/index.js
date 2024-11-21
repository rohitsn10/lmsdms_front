import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  OutlinedInput,
} from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import React, { useState } from "react";
import MDTypography from "components/MDTypography";
import { useViewStatusQuery } from "api/auth/statusApi"; // Assuming this hook fetches the data
import { usePrintApprovalsMutation } from "api/auth/printApi"; // Importing the new API hook

const ApprovalDialog = ({ open, onClose, maxCopies, requestId }) => {  // Accept requestId here
  const [approvalStatusId, setApprovalStatusId] = useState(""); // State to hold the ID of the selected status
  const [numberOfCopies, setNumberOfCopies] = useState("");
  const [printApprovals, { isLoading: isSubmitting, error: submissionError }] = usePrintApprovalsMutation();

  // Fetch status data
  const { data, isLoading, error } = useViewStatusQuery();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Handle the mutation for print approvals
    printApprovals({
      print_request_id: requestId, // Pass the requestId here
      no_of_request_by_admin: numberOfCopies,
      status_id: approvalStatusId,  // Pass the status id to the API
    }).then((response) => {
      console.log("Print approval response:", response);
      onClose(); // Close the dialog after submission
    }).catch((err) => {
      console.error("Error in print approval:", err);
    });
  };

  const handleClear = () => {
    setApprovalStatusId("");
    setNumberOfCopies("");
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
              onChange={(e) =>
                setNumberOfCopies(Math.min(Number(e.target.value), maxCopies))
              }
              helperText={`Maximum copies allowed: ${maxCopies}`}
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="approval-status-label">Approval Status</InputLabel>
            <Select
              labelId="approval-status-label"
              id="approval-status"
              value={approvalStatusId}
              onChange={(e) => setApprovalStatusId(e.target.value)}
              input={<OutlinedInput label="Approval Status" />}
              sx={{
                minWidth: 200,
                height: "3rem",
                ".MuiSelect-select": { padding: "0.45rem" },
              }}
              fullWidth
            >
              {/* Handle loading and error states */}
              {isLoading && <MenuItem disabled>Loading...</MenuItem>}
              {error && <MenuItem disabled>Error loading statuses</MenuItem>}

              {/* Map fetched data into MenuItem components */}
              {data &&
                data.map((statusItem) => (
                  <MenuItem key={statusItem.id} value={statusItem.id}>
                    {statusItem.status} {/* Display status name */}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={onClose} color="error" sx={{ marginRight: "10px" }}>
            Cancel
          </MDButton>
          <MDBox>
            <MDButton variant="gradient" color="submit" fullWidth type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </MDButton>
          </MDBox>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Define PropTypes
ApprovalDialog.propTypes = {
  open: PropTypes.bool.isRequired, // Dialog open state
  onClose: PropTypes.func.isRequired, // Callback function to close dialog
  maxCopies: PropTypes.number.isRequired, // Maximum allowed copies
  requestId: PropTypes.number.isRequired, // requestId prop added
};

export default ApprovalDialog;
