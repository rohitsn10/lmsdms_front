import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

function EditPrinter() {
  const { id } = useParams(); // Assume the printer ID is passed via URL parameters
  const [printerName, setPrinterName] = useState("");
  const [printerPath, setPrinterPath] = useState("");
  const [errors, setErrors] = useState({});
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);

  const navigate = useNavigate();

  // Simulating fetching existing printer data (Replace with actual API call)
  useEffect(() => {
    // Example: Fetch printer data using the ID
    // fetchPrinterById(id).then((data) => {
    //   setPrinterName(data.printerName);
    //   setPrinterPath(data.printerPath);
    // });
    // Mock data for demonstration:
    setPrinterName("Example Printer");
    setPrinterPath("C:\\Printers\\Example");
  }, [id]);

  const validateInputs = () => {
    const newErrors = {};
    if (!printerName.trim()) newErrors.printerName = "Printer Name is required.";
    if (!printerPath.trim()) newErrors.printerPath = "Printer Path is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Valid if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) return; // Stop submission if validation fails

    toast.success("Printer updated successfully!");
    setOpenSignatureDialog(true);
  };

  const handleClear = () => {
    setPrinterName("");
    setPrinterPath("");
    setErrors({});
  };

  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false);
    navigate("/printer-listing");
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
            Edit Printer
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
                label="Printer Name"
                fullWidth
                value={printerName}
                onChange={(e) => setPrinterName(e.target.value)}
                error={!!errors.printerName}
                helperText={errors.printerName}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                label="Printer Path"
                fullWidth
                value={printerPath}
                onChange={(e) => setPrinterPath(e.target.value)}
                error={!!errors.printerPath}
                helperText={errors.printerPath}
              />
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit">
                Save Changes
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

export default EditPrinter;
