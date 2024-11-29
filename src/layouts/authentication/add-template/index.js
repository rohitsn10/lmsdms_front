import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useCreateTemplateMutation, useEditTemplateMutation } from "api/auth/documentApi";

function AddTemplate() {
  const [templateName, setTemplateName] = useState("");
  const [templateFile, setTemplateFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const navigate = useNavigate();

  const [createTemplate, { isLoading: isCreating }] = useCreateTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useEditTemplateMutation();

  const validateInputs = () => {
    const newErrors = {};
    if (!templateName.trim()) newErrors.templateName = "Template Name is required.";
    if (!templateFile) newErrors.templateFile = "Template File is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const formData = new FormData();
    formData.append("template_name", templateName);
    formData.append("template_doc", templateFile);

    try {
      const response = await createTemplate(formData).unwrap();
      console.log("RESPONSE", response);
      toast.success("Template added successfully!");
      setOpenSignatureDialog(true);
    } catch (error) {
      console.error("Error in template action:", error);
      toast.error("Failed to add template. Please try again.");
    }
  };

  const handleClear = () => {
    setTemplateName("");
    setTemplateFile(null);
    setErrors({});
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
            Add or Update Template
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
                error={!!errors.templateName}
                helperText={errors.templateName}
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
                error={!!errors.templateFile}
                helperText={errors.templateFile}
              />
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? "Processing..." : "Submit"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
        <ESignatureDialog open={openSignatureDialog} handleClose={handleCloseSignatureDialog} />
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </BasicLayout>
  );
}

export default AddTemplate;
