import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateDocumentMutation,
  useFetchDocumentTypesQuery,
  useViewTemplateQuery,
} from "api/auth/documentApi";
import { useFetchWorkflowsQuery } from "api/auth/workflowApi";
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

function AddDocument() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [description, setDescription] = useState("");
  const [revisionTime, setRevisionTime] = useState("");
  const [workflow, setWorkflow] = useState("");
  const [parentDocument, setParentDocument] = useState("");
  const [trainingRequired, setTrainingRequired] = useState("No");
  const [template, setTemplate] = useState("");
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [operations, setOperations] = useState('Create online');

  const navigate = useNavigate();
  const [createDocument] = useCreateDocumentMutation();
  const { data: documentTypesData } = useFetchDocumentTypesQuery();
  const { data: templateData } = useViewTemplateQuery();
  const {
    data: workflowsData,
    error: workflowsError,
    isLoading: workflowsLoading,
  } = useFetchWorkflowsQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const documentData = {
        document_title: title,
        document_number: documentNumber,
        document_type: type,
        document_description: description,
        revision_time: revisionTime,
        document_operation: operations,
        select_template: template,
        workflow: workflow,
        training_required: trainingRequired.toLowerCase() === "yes", // Normalize and check
        document_current_status_id:"1"
      };
      await createDocument(documentData).unwrap();
      setOpenSignatureDialog(true);
    } catch (error) {
      console.error("Error creating document:", error);
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
    setParentDocument("");
    setTrainingRequired("No");
    setTemplate("");
  };
  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false);
    navigate("/document-listing");
    console.log("template id: ", template);
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
            Add Document
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
                >
                  {documentTypesData?.map((docType) => (
                    <MenuItem key={docType.id} value={docType.id}>
                      {docType.document_name}
                    </MenuItem>
                  ))}
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
                <FormControlLabel value="Create online" control={<Radio />} label="Create online" />
                <FormControlLabel
                  value="Upload files"
                  control={<Radio />}
                  label="Upload files"
                  disabled // Disable the "Upload files" option
                />
              </RadioGroup>
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
                >
                  {workflowsLoading ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : workflowsError ? (
                    <MenuItem disabled>Error loading workflows</MenuItem>
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
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-template-label">Select Template</InputLabel>
                <Select
                  labelId="select-template-label"
                  id="select-template"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  input={<OutlinedInput label="Select Template" />}
                  sx={{
                    minWidth: 200,
                    height: "3rem",
                    ".MuiSelect-select": { padding: "0.45rem" },
                  }}
                >
                  {templateData?.map((templateItem) => (
                    <MenuItem key={templateItem.id} value={templateItem.id}>
                      {templateItem.template_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={3} display="flex" alignItems="center">
              <FormLabel
                component="legend"
                style={{ fontSize: "0.875rem", color: "black", marginRight: "16px" }}
              >
                Training Required
              </FormLabel>
              <RadioGroup
                row
                value={trainingRequired}
                onChange={(e) => setTrainingRequired(e.target.value)}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </MDBox>

            <MDBox mt={4}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit">
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>

        <ESignatureDialog open={openSignatureDialog} handleClose={handleCloseSignatureDialog} />
      </Card>
    </BasicLayout>
  );
}

export default AddDocument;
