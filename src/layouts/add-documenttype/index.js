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
import { useCreateDocumentTypeMutation } from "api/auth/documentApi";

function AddDocumentType() {
  const [documentTypeName, setDocumentTypeName] = useState("");
  const [errors, setErrors] = useState({});
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [createDocumentType, { isLoading }] = useCreateDocumentTypeMutation();
  const navigate = useNavigate();

  const validateInputs = () => {
    const newErrors = {};
    if (!documentTypeName.trim()) {
      newErrors.documentTypeName = "Document Type Name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
  
    try {
      const response = await createDocumentType({
        document_name: documentTypeName.trim(),
        token: sessionStorage.getItem("token"),
      }).unwrap();
  
      console.log("API Response:", response);
  
      if (response && response.status === true) {
        toast.success("Document Type added successfully!");
        setOpenSignatureDialog(true);
      } else {
        console.error("Document type creation failed:", response.message || "Unknown error");
        toast.error(response.message || "Failed to add Document Type. Please try again.");
      }
    } catch (error) {
      console.error("Error creating document type:", error);
      toast.error("Failed to add Document Type. Please try again.");
    }
  };
  

  const handleClear = () => {
    setDocumentTypeName("");
    setErrors({});
  };

  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false); // Close the dialog
    navigate("/document-typelisting"); // Redirect to document types listing page
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
            Add Document Type
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
                label="Document Type Name"
                fullWidth
                value={documentTypeName}
                onChange={(e) => setDocumentTypeName(e.target.value)}
                error={!!errors.documentTypeName}
                helperText={errors.documentTypeName}
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

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </BasicLayout>
  );
}

export default AddDocumentType;
