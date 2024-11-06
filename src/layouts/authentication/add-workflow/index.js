import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import ESignatureDialog from "layouts/authentication/ESignatureDialog";
import { useCreateWorkflowMutation } from "api/auth/workflowApi"; // Import the mutation

function AddWorkflow() {
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [createWorkflow, { isLoading }] = useCreateWorkflowMutation(); // Hook to call the mutation
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createWorkflow({
        workflow_name: workflowName,
        workflow_description: workflowDescription,
      }).unwrap();

      console.log("API Response:", response); // Log the response to check if status is true

      // Verify if response has a truthy status
      if (response.status) {
        setOpenSignatureDialog(true); // Opens the signature dialog
      } else {
        console.error("Workflow creation failed:", response.message);
      }
    } catch (error) {
      console.error("Error creating workflow:", error);
    }
  };

  const handleClear = () => {
    setWorkflowName("");
    setWorkflowDescription("");
  };

  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false);
    navigate("/dashboard");
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
            Add Workflow
          </MDTypography>
        </MDBox>
        <MDBox mt={2} mb={1} display="flex" justifyContent="flex-end">
          <MDButton
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClear}
            sx={{ marginLeft: '10px', marginRight: '10px' }}
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
              />
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* E-Signature Dialog */}
      <ESignatureDialog open={openSignatureDialog} handleClose={handleCloseSignatureDialog} />
    </BasicLayout>
  );
}

export default AddWorkflow;
