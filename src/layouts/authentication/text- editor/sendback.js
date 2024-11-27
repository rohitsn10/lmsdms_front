import React from "react";
import PropTypes from "prop-types"; // Correctly imported
import {
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  FormControl,
  Select,
  OutlinedInput,
  InputLabel,
} from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useUserListQuery } from "api/auth/userApi"; // Replace with the actual path to your query hook

const handleClear = () => {
  setAssignedTo("");
};

const SendBackDialog = ({
  open,
  onClose,
  onConfirm,
  assignedTo,
  setAssignedTo,
  statusSendBack,
  setStatusSendBack,
}) => {
  const { data: userData, isLoading, error } = useUserListQuery();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <MDBox sx={{ textAlign: "center" }}>
        <MDTypography variant="h4" fontWeight="medium" color="#344767" mt={1}>
          Send Back
        </MDTypography>
      </MDBox>

      <form onSubmit={(e) => e.preventDefault()}>
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
              {!isLoading && userData?.data?.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {`${user.first_name || ""} ${user.last_name || ""}`.trim()}
                </MenuItem>
              ))}
              {error && (
                <MenuItem disabled>
                  Error loading users
                </MenuItem>
              )}
            </Select>
          </FormControl>
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
  statusSendBack: PropTypes.string,
  setStatusSendBack: PropTypes.func.isRequired,
};

export default SendBackDialog;
