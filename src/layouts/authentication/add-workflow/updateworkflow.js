import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { useUpdateWorkflowMutation } from 'api/auth/workflowApi';

const UpdateWorkflow = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [workflowName, setWorkflowName] = useState(state?.workflow.workflow_name || "");
    const [workflowDescription, setWorkflowDescription] = useState(state?.workflow.workflow_description || "");
    const [updateWorkflow, { isLoading }] = useUpdateWorkflowMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateWorkflow({
                workflow_id: state.workflow.id,   
                workflow_name: workflowName,
                workflow_description: workflowDescription,
            }).unwrap();

            console.log("API Response:", response);

            if (response.status) {
                navigate("/workflow-listing");
            } else {
                console.error("Workflow update failed:", response.message);
            }
        } catch (error) {
            console.error("Error updating workflow:", error.message || error);
        }
    };

    const handleClear = () => {
        setWorkflowName("");
        setWorkflowDescription("");
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
                                {isLoading ? "Updating..." : "Update"}
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </BasicLayout>
    );
};

export default UpdateWorkflow;
