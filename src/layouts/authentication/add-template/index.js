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
import { useCreateTemplateMutation } from "api/auth/documentApi";

function AddTemplate() {
  const [templateName, setTemplateName] = useState("");
  const [templateFile, setTemplateFile] = useState(null);
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const navigate = useNavigate();
  
  // Use the createTemplate mutation
  const [createTemplate, { isLoading }] = useCreateTemplateMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError(null); // Clear any previous error

    const formData = new FormData();
    formData.append("template_name", templateName);
    formData.append("template_file", templateFile);

    // Log FormData entries to verify structure
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      // Call createTemplate mutation with formData
      const response = await createTemplate(formData).unwrap();

      if (response.status) {
        setOpenSignatureDialog(true); // Open dialog on success
      } else {
        setSubmissionError(response.message || "Template creation failed. Please try again.");
      }
    } catch (error) {
      if (error.data) {
        setSubmissionError(`Backend error: ${error.data.message}`);
      } else {
        setSubmissionError("An error occurred while creating the template. Please try again.");
      }
      console.error("Error creating template:", error);
    }
  };

  const handleClear = () => {
    setTemplateName("");
    setTemplateFile(null);
    setSubmissionError(null); // Clear error message on reset
  };

  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false);
    navigate("/template-listing");
  };

  const handleFileChange = (e) => {
    setTemplateFile(e.target.files[0]);
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
            Add Template
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
                label="Template Name"
                fullWidth
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="file"
                label="Upload Template File"
                fullWidth
                onChange={handleFileChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ accept: ".pdf,.docx,.txt" }}
              />
            </MDBox>
            
            {/* Display error message if submission fails */}
            {submissionError && (
              <MDTypography variant="body2" color="error" mb={2}>
                {submissionError}
              </MDTypography>
            )}

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

export default AddTemplate;
