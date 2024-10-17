// Import necessary components
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from "@mui/material";

// Example document options (Replace with actual options)
const documents = ["Document 1", "Document 2", "Document 3"];
const statuses = ["Draft", "Final", "Effective"];

function Watermark() {
  const [document, setDocument] = useState("");
  const [stageStatus, setStageStatus] = useState("Draft");
  const [watermarkText, setWatermarkText] = useState("");

  const createdAt = new Date().toLocaleDateString(); // Auto-filled date
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Update the watermark text based on the selected status
  const handleStageStatusChange = (e) => {
    const status = e.target.value;
    setStageStatus(status);
    let watermark = "";
    if (status === "Draft") watermark = "DRAFT";
    else if (status === "Final") watermark = "FINAL";
    else if (status === "Effective") watermark = "EFFECTIVE";
    setWatermarkText(watermark);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Watermark Details Submitted:", {
      document,
      watermarkText,
      stageStatus,
      createdAt,
    });
    // Navigate to a different page if needed
    navigate("/dashboard");
  };

  // Function to clear all input fields
  const handleClear = () => {
    setDocument("");
    setStageStatus("Draft");
    setWatermarkText("");
  };

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 600, mx: "auto" }}>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            Watermark Document
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-document-label">Document</InputLabel>
                <Select
                  labelId="select-document-label"
                  id="select-document"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  input={<OutlinedInput label="Document" />}
                  sx={{ minWidth: 200 }}
                >
                  {documents.map((doc) => (
                    <MenuItem key={doc} value={doc}>
                      {doc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Watermark Text"
                fullWidth
                value={watermarkText}
                disabled // Auto-filled based on Stage Status
              />
            </MDBox>

            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-status-label">Stage Status</InputLabel>
                <Select
                  labelId="select-status-label"
                  id="select-status"
                  value={stageStatus}
                  onChange={handleStageStatusChange}
                  input={<OutlinedInput label="Stage Status" />}
                  sx={{ minWidth: 200 }}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Created At"
                fullWidth
                value={createdAt}
                disabled // Auto-filled with the current date
              />
            </MDBox>

            <MDBox mt={2} mb={1} display="flex" justifyContent="space-between">
              <MDButton
                variant="outlined"
                color="error"
                size="small"
                onClick={handleClear}
                sx={{ alignSelf: 'flex-end' }}
              >
                Clear
              </MDButton>
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Watermark;
