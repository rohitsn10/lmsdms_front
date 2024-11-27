import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import ESignatureDialog from "layouts/authentication/ESignatureDialog";
import { useUpdateWorkflowMutation } from "api/auth/workflowApi";

const UpdateWorkflow = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [workflowName, setWorkflowName] = useState(state?.workflow.workflow_name || "");
  const [workflowDescription, setWorkflowDescription] = useState(
    state?.workflow.workflow_description || ""
  );
  const [errors, setErrors] = useState({});
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [updateWorkflow, { isLoading }] = useUpdateWorkflowMutation();

  const validateInputs = () => {
    const newErrors = {};
    if (!workflowName.trim()) newErrors.workflowName = "Workflow Name is required.";
    if (!workflowDescription.trim()) newErrors.workflowDescription = "Workflow Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Valid if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return; // Stop submission if validation fails

    try {
      const response = await updateWorkflow({
        workflow_id: state.workflow.id,
        workflow_name: workflowName.trim(),
        workflow_description: workflowDescription.trim(),
      }).unwrap();

      console.log("API Response:", response);

      if (response.status) {
        toast.success("Workflow updated successfully!");
        setOpenSignatureDialog(true);
      } else {
        toast.error(response.message || "Failed to update workflow. Please try again.");
      }
    } catch (error) {
      console.error("Error updating workflow:", error.message || error);
      toast.error("An error occurred while updating the workflow.");
    }
  };

  const handleClear = () => {
    setWorkflowName("");
    setWorkflowDescription("");
    setErrors({});
  };

  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false);
    navigate("/workflow-listing");
  };

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 600, mx: "auto" }}>
        <MDBox
          borderRadius="lg"
          sx={{
            background: "linear-gradient(212deg, #d5b282, #f5e0c3)",
            borderRadius: "lg",
            mx: 2,
            mt: -3,
            p: 2,
            mb: 1,
            textAlign: "center",
          }}
        >
          <MDTypography variant="h3" fontWeight="medium" color="#344767" mt={1}>
            Update Workflow
          </MDTypography>
        </MDBox>

        <MDBox mt={2} mb={1} display="flex" justifyContent="flex-end">
          <MDButton
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClear}
            sx={{ marginLeft: "10px", marginRight: "10px" }}
          >
            Clear
          </MDButton>
        </MDBox>

        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Workflow Name"
                fullWidth
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                error={!!errors.workflowName}
                helperText={errors.workflowName}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                label="Workflow Description"
                multiline
                rows={4}
                fullWidth
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                error={!!errors.workflowDescription}
                helperText={errors.workflowDescription}
              />
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* E-Signature Dialog */}
      <ESignatureDialog open={openSignatureDialog} handleClose={handleCloseSignatureDialog} />

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </BasicLayout>
  );
};

export default UpdateWorkflow;
