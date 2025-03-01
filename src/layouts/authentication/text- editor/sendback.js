import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  FormControl,
  Select,
  OutlinedInput,
  InputLabel,
  TextField,
} from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useGetApprovedStatusUsersQuery } from "api/auth/texteditorApi";

const handleClear = (setAssignedTo, setRemarks) => {
  setAssignedTo("");
  setRemarks(""); // Clear remarks as well
};

const SendBackDialog = ({
  open,
  onClose,
  onConfirm,
  assignedTo,
  setAssignedTo,
  remarks,
  setRemarks,
  documentId,
}) => {
  // Fetch approved status users using RTK Query
  const { data: users, isLoading, error } = useGetApprovedStatusUsersQuery(documentId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <MDBox sx={{ textAlign: "center" }}>
        <MDTypography variant="h4" fontWeight="medium" color="#344767" mt={1}>
          Send Back
        </MDTypography>
      </MDBox>

      <form onSubmit={(e) => e.preventDefault()}>
        <DialogContent>
          {/* Clear Button */}
          <MDBox display="flex" justifyContent="flex-end">
            <MDButton
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleClear(setAssignedTo, setRemarks)}
              sx={{ marginRight: "20px" }}
            >
              Clear
            </MDButton>
          </MDBox>

          {/* Assigned To Dropdown */}
          <FormControl fullWidth margin="dense">
            <InputLabel id="assigned-to-label">Assigned To</InputLabel>
            <Select
              labelId="assigned-to-label"
              id="assigned-to"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              input={<OutlinedInput label="Assigned To" />}
              sx={{
                minWidth: 200,
                height: "3rem",
                ".MuiSelect-select": { padding: "0.45rem" },
              }}
            >
              {isLoading && <MenuItem disabled>Loading users...</MenuItem>}
              {error && <MenuItem disabled>Error loading users</MenuItem>}
              {!isLoading &&
                Array.isArray(users) &&
                users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.first_name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Remarks Field */}
          <TextField
            fullWidth
            margin="dense"
            label="Remarks"
            variant="outlined"
            multiline
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <MDButton onClick={onClose} color="error" sx={{ marginRight: "10px" }}>
            Cancel
          </MDButton>
          <MDBox>
            <MDButton variant="gradient" color="submit" fullWidth onClick={onConfirm}>
              Confirm
            </MDButton>
          </MDBox>
        </DialogActions>
      </form>
    </Dialog>
  );
};

SendBackDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  assignedTo: PropTypes.string,
  setAssignedTo: PropTypes.func.isRequired,
  remarks: PropTypes.string,
  setRemarks: PropTypes.func.isRequired,
  documentId: PropTypes.string.isRequired,
};

export default SendBackDialog;
