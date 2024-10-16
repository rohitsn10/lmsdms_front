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
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const documentTypes = ["Policy", "SOP", "Guideline"]; // Example types
const workflows = ["Initial", "Review", "Approved", "Released"]; // Workflow options

function AddDocument() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [description, setDescription] = useState("");
  const [revisionTime, setRevisionTime] = useState("");
  const [operations, setOperations] = useState("");
  const [workflow, setWorkflow] = useState("");
  const [parentDocument, setParentDocument] = useState("");
  const [trainingRequired, setTrainingRequired] = useState(false);
  const [version, setVersion] = useState("");

  // Simulated auto-filled fields
  const createdBy = "John Doe"; // Replace with the logged-in user's name
  const createdAt = new Date().toLocaleDateString(); // Auto-fill the current date

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Document Details Submitted:", {
      title,
      type,
      documentNumber,
      description,
      revisionTime,
      operations,
      workflow,
      parentDocument,
      trainingRequired,
      version,
      createdBy,
      createdAt,
    });
    // Navigate to a different page if needed
    navigate("/dashboard");
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
    setTrainingRequired(false);
    setVersion("");
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
            Add Document
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-type-label">Type</InputLabel>
                <Select
                  labelId="select-type-label"
                  id="select-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  input={<OutlinedInput label="Type" />}
                  sx={{ minWidth: 200 }} // Ensure dropdown has a minimum width
                >
                  {documentTypes.map((docType) => (
                    <MenuItem key={docType} value={docType}>
                      {docType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Document Number"
                fullWidth
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                label="Description"
                multiline
                rows={4} // Set the number of rows for the textarea
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="number"
                label="Revision Time (in Months)"
                fullWidth
                value={revisionTime}
                onChange={(e) => setRevisionTime(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-operations-label">Operations</InputLabel>
                <Select
                  labelId="select-operations-label"
                  id="select-operations"
                  value={operations}
                  onChange={(e) => setOperations(e.target.value)}
                  input={<OutlinedInput label="Operations" />}
                  sx={{ minWidth: 200 }} // Ensure dropdown has a minimum width
                >
                  <MenuItem value="Create Document - Online">Create Document - Online</MenuItem>
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-workflow-label">Workflow</InputLabel>
                <Select
                  labelId="select-workflow-label"
                  id="select-workflow"
                  value={workflow}
                  onChange={(e) => setWorkflow(e.target.value)}
                  input={<OutlinedInput label="Workflow" />}
                  sx={{ minWidth: 200 }} // Ensure dropdown has a minimum width
                >
                  {workflows.map((wf) => (
                    <MenuItem key={wf} value={wf}>
                      {wf}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-parent-document-label">Parent Document</InputLabel>
                <Select
                  labelId="select-parent-document-label"
                  id="select-parent-document"
                  value={parentDocument}
                  onChange={(e) => setParentDocument(e.target.value)}
                  input={<OutlinedInput label="Parent Document" />}
                  sx={{ minWidth: 200 }} // Ensure dropdown has a minimum width
                >
                  <MenuItem value="">None</MenuItem>
                  {/* Populate this dropdown with existing documents */}
                  {/* {existingDocuments.map((doc) => (
                    <MenuItem key={doc.id} value={doc.id}>
                      {doc.title}
                    </MenuItem>
                  ))} */}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={trainingRequired}
                    onChange={(e) => setTrainingRequired(e.target.checked)}
                  />
                }
                label="Training Required"
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Version"
                fullWidth
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </MDBox>

            {/* Auto-filled fields */}
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Created By"
                fullWidth
                value={createdBy}
                disabled
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Created At"
                fullWidth
                value={createdAt}
                disabled
              />
            </MDBox>

            <MDBox mt={2} mb={1} display="flex" justifyContent="space-between">
              <MDButton
                variant="outlined"
                color="error"
                size="small" // Set the button size to small
                onClick={handleClear}
                sx={{ alignSelf: 'flex-end' }} // Align button to the right
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

export default AddDocument;
