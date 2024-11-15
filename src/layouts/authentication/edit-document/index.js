import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import ESignatureDialog from "layouts/authentication/ESignatureDialog/index.js";
import { useFetchDocumentDetailsQuery, useUpdateDocumentMutation } from "api/auth/editDocumentApi";
import { useFetchDocumentTypesQuery } from "api/auth/documentApi";
import { useFetchWorkflowsQuery } from "api/auth/workflowApi"; // Adjust import according to your file structure

function EditDocument() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [description, setDescription] = useState("");
  const [revisionTime, setRevisionTime] = useState("");
  const [operations, setOperations] = useState("Upload files");
  const [workflow, setWorkflow] = useState("");
  const [trainingRequired, setTrainingRequired] = useState("No");
  const [templateFile, setTemplateFile] = useState(null);
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch document details using API
  const { data: documentDetails, isLoading: documentDetailsLoading } =
    useFetchDocumentDetailsQuery(id);
  const [updateDocument] = useUpdateDocumentMutation();

  // Fetch dropdown data using API
  const { data: documentTypesData, isLoading: documentTypesLoading } = useFetchDocumentTypesQuery();
  const {
    data: workflowsData,
    isLoading: workflowsLoading,
    error: workflowsError,
  } = useFetchWorkflowsQuery();

  useEffect(() => {
    if (documentDetails) {
      setTitle(documentDetails.document_title || ""); 
      setType(documentDetails.document_type || ""); 
      setDocumentNumber(documentDetails.document_number || ""); 
      setDescription(documentDetails.document_description || ""); 
      setRevisionTime(documentDetails.revision_time || ""); 
      setOperations(documentDetails.document_operation || ""); 
      setWorkflow(documentDetails.workflow || ""); 
      setTrainingRequired(documentDetails.trainingRequired || "No"); 
    }
  }, [documentDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDocument({
        document_id: id,
        document_title: title,
        document_type: type,
        document_number: documentNumber,
        document_description: description,
        revision_time: revisionTime,
        document_operation: operations,
        workflow,
        trainingRequired,
      });
      setOpenSignatureDialog(true);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleClear = () => {
    setTitle("");
    setType("");
    setDocumentNumber("");
    setDescription("");
    setRevisionTime("");
    setOperations("");
    setWorkflow("");
    setTrainingRequired("No");
    setTemplateFile(null);
  };

  const handleFileChange = (e) => {
    setTemplateFile(e.target.files[0]);
  };

  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false);
    navigate("/document-listing");
  };

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 600, mx: "auto", marginTop: 10, marginBottom: 10 }}>
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
            Edit Document
          </MDTypography>
        </MDBox>
        <MDBox mt={2} mb={1} display="flex" justifyContent="flex-end">
          <MDButton
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClear}
            sx={{ marginRight: "20px" }}
          >
            Clear
          </MDButton>
        </MDBox>
        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
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
                  sx={{
                    minWidth: 200,
                    height: "3rem",
                    ".MuiSelect-select": { padding: "0.45rem" },
                  }}
                  disabled={documentTypesLoading} 
                >
                  {documentTypesLoading ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : (
                    documentTypesData?.map((docType) => (
                      <MenuItem key={docType.id} value={docType.id}>
                        {docType.document_name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Document Number"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                fullWidth
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Revision Time"
                value={revisionTime}
                onChange={(e) => setRevisionTime(e.target.value)}
                fullWidth
              />
            </MDBox>
            <MDBox mb={3} display="flex" alignItems="center">
              <FormLabel
                component="legend"
                style={{ fontSize: "0.875rem", color: "black", marginRight: "16px" }}
              >
                Operations
              </FormLabel>
              <RadioGroup row value={operations} onChange={(e) => setOperations(e.target.value)}>
                <FormControlLabel
                  value="Create online"
                  control={<Radio disabled />}
                  label="Create online"
                />
                <FormControlLabel value="Upload files" control={<Radio />} label="Upload files" />
              </RadioGroup>
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

            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-workflow-label">Workflow</InputLabel>
                <Select
                  labelId="select-workflow-label"
                  id="select-workflow"
                  value={workflow}
                  onChange={(e) => setWorkflow(e.target.value)}
                  input={<OutlinedInput label="Workflow" />}
                  sx={{
                    minWidth: 200,
                    height: "3rem",
                    ".MuiSelect-select": { padding: "0.45rem" },
                  }}
                  disabled={workflowsLoading} 
                >
                  {workflowsLoading ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : (
                    workflowsData?.map((flow) => (
                      <MenuItem key={flow.id} value={flow.id}>
                        {flow.workflow_name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </MDBox>

            <MDBox mt={4}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit">
                Update
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      <ESignatureDialog open={openSignatureDialog} onClose={handleCloseSignatureDialog} />
    </BasicLayout>
  );
}

export default EditDocument;
