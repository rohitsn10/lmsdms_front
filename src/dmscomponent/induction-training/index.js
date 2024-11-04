// AddInductionTraining.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, MenuItem, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import ESignatureDialog from "layouts/authentication/ESignatureDialog"; // Ensure correct import

function AddInductionTraining() {
  const [inductionTitle, setInductionTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [document, setDocument] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpenSignatureDialog(true); // Open dialog on form submission
    console.log("Induction Training Details Submitted:", { 
      inductionTitle, department, document, startDate, endDate, location 
    });
  };

  const handleClear = () => {
    setInductionTitle("");
    setDepartment("");
    setDocument(null);
    setStartDate("");
    setEndDate("");
    setLocation("");
  };

  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false); // Close the dialog
    navigate("/dashboard"); // Navigate after closing
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
            Add Induction Training
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
                label="Induction Title"
                fullWidth
                value={inductionTitle}
                onChange={(e) => setInductionTitle(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}
            >
              <TextField
                select
                label="Department Name"
                fullWidth
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                sx={{
                  height: "40px", // Set desired height here
                  "& .MuiInputBase-root": {
                    minHeight: "2.4265em",
                    height: "100%", // Ensures the inner select aligns with the specified height
                  },
                }}
              >
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
                {/* Add other departments as necessary */}
              </TextField>
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="file"
                label="Upload Document (PPT)"
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ accept: ".ppt, .pptx" }}
                onChange={handleFileChange}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="date"
                label="Induction Start Date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="date"
                label="Induction End Date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Training Location"
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit">
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* E-Signature Dialog */}
      <ESignatureDialog
        open={openSignatureDialog}
        handleClose={handleCloseSignatureDialog}
      />
    </BasicLayout>
  );
}

export default AddInductionTraining;
