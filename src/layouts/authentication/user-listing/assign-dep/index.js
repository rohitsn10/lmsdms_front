import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  OutlinedInput,
} from "@mui/material";
import { useFetchDepartmentsQuery } from "api/auth/departmentApi";
import PropTypes from "prop-types"; // Import PropTypes
import MDButton from "components/MDButton";
import { useAssignDepartmentMutation } from "api/auth/departmentApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserListQuery } from "api/auth/userApi";

const AssignDepartmentDialog = ({ open, onClose, fullName, selectedUserid }) => {
  const [department, setDepartment] = useState("");
    const { refetch } = useUserListQuery();
  const { data: departmentsData, isLoading: isDepartmentsLoading } = useFetchDepartmentsQuery();
  const [assignDepartment, { isLoading }] = useAssignDepartmentMutation();
  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  const handleAssign = async () => {
    try {
      await assignDepartment({ department_id: department, user_id: selectedUserid }).unwrap();
      toast.success(`Department assigned successfully to ${fullName}!`);
      refetch();
      onClose(); // Close the dialog
    } catch (error) {
      toast.error(error.message || "Failed to assign department"); // Show error toast
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assigned department to {fullName}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel id="select-department-label">Assign Department</InputLabel>
          <Select
            labelId="select-department-label"
            id="select-department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            input={<OutlinedInput label="Assign Department" />}
            sx={{
              minWidth: 200,
              height: "3rem",
              ".MuiSelect-select": {
                padding: "0.75rem",
              },
            }}
            disabled={isDepartmentsLoading}
          >
            {isDepartmentsLoading ? (
              <MenuItem disabled>Loading departments...</MenuItem>
            ) : (
              departmentsData?.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.department_name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <MDButton onClick={onClose} color="primary">
          Cancel
        </MDButton>
        <MDButton onClick={handleAssign} variant="gradient" color="submit" disabled={!department}>
          {isDepartmentsLoading ? <CircularProgress size={24} /> : "Assign"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

// PropTypes validation
AssignDepartmentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fullName: PropTypes.string.isRequired,
  selectedUserid: PropTypes.number.isRequired,
};

export default AssignDepartmentDialog;
