import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import {
  useCreateJobDescriptionMutation,
  useGetJobDescriptionListQuery,
  useSaveDescriptionMutation,
} from "apilms/jobRoleApi";
import { toast } from "react-toastify";
import { useGetJobRoleQuery } from "apilms/jobRoleApi";

const JobDescriptionDialog = ({ open, onClose, userId, remark }) => {
  const [jobDescription, setJobDescription] = useState("");

  // Fetch job descriptions for the given user
  const {
    data,
    isLoading: isDataLoading,
    isError: isDataError,
    refetch, // To refresh data when opening dialog
  } = useGetJobDescriptionListQuery(userId, { skip: !userId });
  const [jobRoleId, setJobRoleId] = useState("");
  const [createJobDescription, { isLoading }] = useCreateJobDescriptionMutation();
  const [saveDescription, { isLoading: isSaveLoading }] = useSaveDescriptionMutation();
  const {
    data: jobRoleData,
    isLoading: isJobRoleLoading,
    isError: isJobRoleError,
  } = useGetJobRoleQuery();

  // Fetch job description when data is available or dialog opens
  useEffect(() => {
    if (open) {
      refetch(); // Fetch the latest data every time the dialog opens

      if (data?.data?.length > 0) {
        // Prioritize "send_back" status if available, otherwise take "draft"
        const jobDesc =
          data.data.find((item) => item.status === "send_back") ||
          data.data.find((item) => item.status === "draft");

        setJobDescription(jobDesc ? jobDesc.employee_job_description : "");
      } else {
        setJobDescription(""); // Clear if no data
      }
    }
  }, [open, data]);

  const handleChange = (event) => setJobDescription(event.target.value);
  const [errors, setErrors] = useState({});
  const handleSubmit = async () => {
    if (!jobRoleId) {
      toast.error("Job role is required.");
      return;
    }

    if (!jobDescription.trim()) {
      toast.warning("Please enter a job description.");
      return;
    }

    try {
      await createJobDescription({
        user_id: userId,
        job_role_id: jobRoleId, 
        employee_job_description: jobDescription,
      }).unwrap();

      toast.success("Job description assigned successfully!");
      onClose();
    } catch (error) {
      const msg = error?.data?.message || "Failed to save job description.";
      toast.error(msg);
    }
  };

  const handleSave = async () => {
    if (!jobDescription.trim()) {
      toast.warning("Please enter a job description.");
      return;
    }

    try {
      await saveDescription({ user_id: userId, employee_job_description: jobDescription }).unwrap();
      toast.success("Job description saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving job description:", error);
      toast.error("Failed to save job description. Please try again.");
    }
  };

  const handleCancel = () => {
    setJobDescription(""); // Clear input
    onClose(); // Close dialog
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.25rem", color: "#333" }}
      >
        {remark ? "Assign Job Description to Send Back by HOD" : "Assign Job Description"}
      </DialogTitle>
      <DialogContent>
        {remark && (
          <TextField
            margin="dense"
            label="Remark"
            type="text"
            fullWidth
            value={remark}
            InputProps={{ readOnly: true }}
            sx={{ marginBottom: 2, backgroundColor: "#f4f6f8" }}
          />
        )}
        <MDBox mb={3}>
          <FormControl fullWidth>
            <InputLabel id="select-job-role-label">Job Role</InputLabel>

            <Select
              labelId="select-job-role-label"
              id="select-job-role"
              value={jobRoleId}
              onChange={(e) => setJobRoleId(e.target.value)}
              input={<OutlinedInput label="Job Role" />}
              sx={{
                minWidth: 200,
                height: "3.5rem",
                ".MuiSelect-select": {
                  padding: "0.75rem",
                },
              }}
            >
              {jobRoleData?.data?.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.job_role_name}
                </MenuItem>
              ))}
            </Select>

            {errors?.jobRoleId && <FormHelperText>{errors.jobRoleId}</FormHelperText>}
          </FormControl>
        </MDBox>

        {isJobRoleError && (
          <div style={{ color: "red", marginBottom: 8 }}>Failed to load job roles</div>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="Job Description"
          type="text"
          fullWidth
          value={jobDescription}
          onChange={handleChange}
          required
          multiline
          rows={8}
        />
      </DialogContent>
      <DialogActions>
        <MDButton onClick={handleSave} variant="gradient" color="submit" disabled={isSaveLoading}>
          {isSaveLoading ? "Saving..." : "Save"}
        </MDButton>
        <MDButton onClick={handleCancel} color="error">
          Cancel
        </MDButton>
        <MDButton onClick={handleSubmit} variant="gradient" color="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </MDButton>
      </DialogActions>
      {isDataError && (
        <div style={{ color: "red", padding: "10px", textAlign: "center" }}>
          Failed to load job descriptions.
        </div>
      )}
    </Dialog>
  );
};

JobDescriptionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  remark: PropTypes.string,
};

export default JobDescriptionDialog;
