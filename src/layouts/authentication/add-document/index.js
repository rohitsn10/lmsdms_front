import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import ESignatureDialog from "layouts/authentication/ESignatureDialog/index.js"; // Import the E-Signature dialog

const documentTypes = ["Policy", "SOP", "Guideline"]; // Example types
const workflows = ["Initial", "Review", "Approved", "Released"]; // Workflow options
const templates = ["Template 1", "Template 2", "Template 3"]; // Example templates

function AddDocument() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [description, setDescription] = useState("");
  const [revisionTime, setRevisionTime] = useState("");
  const [operations, setOperations] = useState("");
  const [workflow, setWorkflow] = useState("");
  const [parentDocument, setParentDocument] = useState("");
  const [trainingRequired, setTrainingRequired] = useState("No"); // Default value
  const [version, setVersion] = useState("");
  const [template, setTemplate] = useState(""); // New state for template selection
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false); // State for dialog visibility

  // Simulated auto-filled fields
  const createdBy = "John Doe"; // Replace with the logged-in user's name
  const createdAt = new Date().toLocaleDateString(); // Auto-fill the current date

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    // Open the E-signature dialog on form submission
    setOpenSignatureDialog(true);
  };

  // Function to clear all input fields
  const handleClear = () => {
    setTitle("");
    setType("");
    setDocumentNumber("");
    setDescription("");
    setRevisionTime("");
    setOperations("");
    setWorkflow("");
    setParentDocument("");
    setTrainingRequired("No");
    setVersion("");
    setTemplate(""); // Clear template selection
  };

  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false);
    navigate("/document-view"); // Navigate to the dashboard when dialog is closed
  };

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 600, mx: "auto", marginTop: 10, marginBottom: 10 }}>
        <MDBox
          borderRadius="lg"
          sx={{
            background: "linear-gradient(212deg, #d5b282, #f5e0c3)", // Custom color gradient
            borderRadius: "lg",
            mx: 2,
            mt: -3,
            p: 2,
            mb: 1,
            textAlign: "center",
          }}
        >
          <MDTypography
            variant="h3"
            fontWeight="medium"
            color="#344767"
            mt={1}
          >
            Add Document
          </MDTypography>
        </MDBox>
        <MDBox mt={2} mb={1} display="flex" justifyContent="flex-end">
          <MDButton
            variant="outlined"
            color="error"
            size="small" // Set the button size to small
            onClick={handleClear}
            sx={{ marginRight: "20px" }}
          >
            Clear
          </MDButton>
        </MDBox>
        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            {/* Title field */}
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />
            </MDBox>

            {/* Type field */}
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-type-label">Type</InputLabel>
                <Select
                  labelId="select-type-label"
                  id="select-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  input={<OutlinedInput label="Type" />}
                  sx={{ minWidth: 200, height: "3rem", ".MuiSelect-select": { padding: "0.45rem" } }}
                >
                  {documentTypes.map((docType) => (
                    <MenuItem key={docType} value={docType}>
                      {docType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            {/* Document Number field */}
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Document Number"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                fullWidth
              />
            </MDBox>

            {/* Description field */}
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
            </MDBox>

            {/* Revision Time field */}
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Revision Time"
                value={revisionTime}
                onChange={(e) => setRevisionTime(e.target.value)}
                fullWidth
              />
            </MDBox>

            {/* Operations field */}
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Operations"
                value={operations}
                onChange={(e) => setOperations(e.target.value)}
                fullWidth
              />
            </MDBox>

            {/* Workflow field */}
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-workflow-label">Workflow</InputLabel>
                <Select
                  labelId="select-workflow-label"
                  id="select-workflow"
                  value={workflow}
                  onChange={(e) => setWorkflow(e.target.value)}
                  input={<OutlinedInput label="Workflow" />}
                  sx={{ minWidth: 200, height: "3rem", ".MuiSelect-select": { padding: "0.45rem" } }}
                >
                  {workflows.map((flow) => (
                    <MenuItem key={flow} value={flow}>
                      {flow}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            {/* Parent Document field */}
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Parent Document"
                value={parentDocument}
                onChange={(e) => setParentDocument(e.target.value)}
                fullWidth
              />
            </MDBox>

            {/* Select Template dropdown */}
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-template-label">Select Template</InputLabel>
                <Select
                  labelId="select-template-label"
                  id="select-template"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  input={<OutlinedInput label="Select Template" />}
                  sx={{ minWidth: 200, height: "3rem", ".MuiSelect-select": { padding: "0.45rem" } }}
                >
                  {templates.map((template) => (
                    <MenuItem key={template} value={template}>
                      {template}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            {/* Training Required radio buttons */}
            <MDBox mb={3} display="flex" alignItems="center">
              <FormLabel component="legend" style={{ fontSize: '0.875rem', color: 'black', marginRight: '16px' }}>
                Training Required
              </FormLabel>
              <RadioGroup
                row
                value={trainingRequired}
                onChange={(e) => setTrainingRequired(e.target.value)}
              >
                <FormControlLabel
                  value="Yes"
                  control={<Radio />}
                  label="Yes"
                />
                <FormControlLabel
                  value="No"
                  control={<Radio />}
                  label="No"
                />
              </RadioGroup>
            </MDBox>

            {/* Version field */}
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                fullWidth
              />
            </MDBox>

            {/* Created By and Created At fields (auto-filled) */}
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Created By"
                value={createdBy}
                fullWidth
                disabled // Disable editing for auto-filled fields
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Created At"
                value={createdAt}
                fullWidth
                disabled // Disable editing for auto-filled fields
              />
            </MDBox>

            {/* Submit button */}
            <MDBox mt={4}>
            <MDButton variant="gradient" color="submit" fullWidth type="submit">
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* E-Signature Dialog */}
        <ESignatureDialog
          open={openSignatureDialog}
          handleClose={handleCloseSignatureDialog}
        />
      </Card>
    </BasicLayout>
  );
}

export default AddDocument;
