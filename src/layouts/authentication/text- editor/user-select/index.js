import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { useReviewerUsersQuery, useApproverUsersQuery, useDocAdminUsersQuery } from "api/auth/userApi"; // Import the hooks

const SelectUserDialog = ({ open, onClose, onConfirm }) => {
  const [approver, setApprover] = useState(""); // State for Approver selection
  const [reviewer, setReviewer] = useState([]); // State for Reviewer selection (multiple)
  const [docAdmin, setDocAdmin] = useState(""); // State for Document Admin selection
  const [error, setError] = useState(""); // State to handle any validation errors

  // Use the API hooks to fetch the data
  const { data: approverData, isLoading: isLoadingApprover } = useApproverUsersQuery();
  const { data: reviewerData, isLoading: isLoadingReviewer } = useReviewerUsersQuery();
  const { data: docAdminData, isLoading: isLoadingDocAdmin } = useDocAdminUsersQuery();

  useEffect(() => {
    // Reset selections when the dialog is reopened
    if (open) {
      setApprover("");
      setReviewer([]);
      setDocAdmin("");
      setError("");
    }
  }, [open]);

  const handleConfirm = () => {
    if (!approver || reviewer.length === 0 || !docAdmin) {
      setError("All fields are required"); // Validation if any selection is missing
      return;
    }

    setError(""); // Clear any previous error
    onConfirm({ approver, reviewer, docAdmin }); // Pass the selected users to the parent component
    onClose(); // Close the dialog after confirmation
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <MDBox sx={{ textAlign: "center" }}>
        <MDTypography variant="h4" fontWeight="medium" color="#344767" mt={1}>
          Select Users
        </MDTypography>
      </MDBox>

      <form onSubmit={(e) => e.preventDefault()}>
        <DialogContent>
          {/* Approver Dropdown */}
          <MDBox mb={3}>
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel id="select-approver-label">Select Approver</InputLabel>
              <Select
                labelId="select-approver-label"
                id="select-approver"
                value={approver}
                onChange={(e) => setApprover(e.target.value)}
                input={<OutlinedInput label="Select Approver" />}
                sx={{
                  minWidth: 200,
                  height: "3rem",
                  ".MuiSelect-select": { padding: "0.45rem" },
                }}
              >
                {isLoadingApprover ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : approverData?.data.length > 0 ? (
                  approverData.data.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No approvers available</MenuItem>
                )}
              </Select>
            </FormControl>
          </MDBox>

          {/* Reviewer Dropdown (Multiple Selection) */}
          <MDBox mb={3}>
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel id="select-reviewer-label">Select Reviewer</InputLabel>
              <Select
                labelId="select-reviewer-label"
                id="select-reviewer"
                multiple
                value={reviewer}
                onChange={(e) => setReviewer(e.target.value)}
                input={<OutlinedInput label="Select Reviewer" />}
                sx={{
                  minWidth: 200,
                  height: "3rem",
                  ".MuiSelect-select": { padding: "0.45rem" },
                }}
                renderValue={(selected) =>
                  selected
                    .map((userId) => {
                      const user = reviewerData?.data.find((u) => u.id === userId);
                      return user?.name || userId;
                    })
                    .join(", ")
                }
              >
                {isLoadingReviewer ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : reviewerData?.data.length > 0 ? (
                  reviewerData.data.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No reviewers available</MenuItem>
                )}
              </Select>
            </FormControl>
          </MDBox>

          {/* Doc Admin Dropdown */}
          <MDBox mb={3}>
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel id="select-doc-admin-label">Select Doc Admin</InputLabel>
              <Select
                labelId="select-doc-admin-label"
                id="select-doc-admin"
                value={docAdmin}
                onChange={(e) => setDocAdmin(e.target.value)}
                input={<OutlinedInput label="Select Doc Admin" />}
                sx={{
                  minWidth: 200,
                  height: "3rem",
                  ".MuiSelect-select": { padding: "0.45rem" },
                }}
              >
                {isLoadingDocAdmin ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : docAdminData?.data.length > 0 ? (
                  docAdminData.data.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No document admins available</MenuItem>
                )}
              </Select>
            </FormControl>
          </MDBox>

          {/* Error Message */}
          {error && (
            <MDTypography variant="caption" color="error">
              {error}
            </MDTypography>
          )}
        </DialogContent>

        <DialogActions>
          <MDButton
            onClick={() => {
              setApprover(""); // Clear approver field
              setReviewer([]); // Clear reviewer field (multiple)
              setDocAdmin(""); // Clear doc admin field
              setError(""); // Clear error messages
              onClose(); // Close the dialog
            }}
            color="error"
            sx={{ marginRight: "10px" }}
          >
            Cancel
          </MDButton>
          <MDBox>
            <MDButton
              variant="gradient"
              color="submit"
              fullWidth
              onClick={handleConfirm}
            >
              Confirm Selection
            </MDButton>
          </MDBox>
        </DialogActions>
      </form>
    </Dialog>
  );
};

SelectUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default SelectUserDialog;
