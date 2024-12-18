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
import { useFetchDocumentsQuery } from "api/auth/documentApi";
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
import ESignatureDialog from "layouts/authentication/ESignatureDialog";
import { useFetchDocumentDetailsQuery, useUpdateDocumentMutation } from "api/auth/editDocumentApi";
import { useFetchDocumentTypesQuery } from "api/auth/documentApi";
import { useFetchWorkflowsQuery } from "api/auth/workflowApi";
import { useDepartmentWiseReviewerQuery } from "api/auth/documentApi";

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
  const [errors, setErrors] = useState({});
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  console.log("Document Id in edit ------------",id);

  // API calls
  const { data: documentDetails, isLoading: documentDetailsLoading } = useFetchDocumentsQuery(id);
  const [updateDocument] = useUpdateDocumentMutation();
  const { data: documentTypesData, isLoading: documentTypesLoading } = useFetchDocumentTypesQuery();
  const { data: workflowsData, isLoading: workflowsLoading } = useFetchWorkflowsQuery();

  const { data: userdata, isLoading: isUsersLoading } = useDepartmentWiseReviewerQuery();
  const users = userdata || [];
  // Populate form with existing data
  
  useEffect(() => {
    if (documentDetails) {
      setTitle(documentDetails.document_title || "");
      setType(documentDetails.document_type || "");
      setDocumentNumber(documentDetails.document_number || "");
      setDescription(documentDetails.document_description || "");
      setRevisionTime(documentDetails.revision_time || "");
      setOperations(documentDetails.document_operation || "Upload files");
      setWorkflow(documentDetails.workflow || "");
      setTrainingRequired(documentDetails.trainingRequired || "No");
      setSelectedUsers(documentDetails.visible_to_users || []);
    }
  }, [documentDetails]);

  // Validation
  const validateInputs = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!type) newErrors.type = "Document type is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    setOpenSignatureDialog(true);
  };

  const handleSignatureComplete = async (password) => {
    setOpenSignatureDialog(false);
    if (!password) {
      toast.error("E-Signature is required to proceed.");
      return;
    }

    try {
      await updateDocument({
        document_id: id,
        document_title: title.trim(),
        document_type: type,
        document_number: documentNumber.trim(),
        document_description: description.trim(),
        revision_time: revisionTime.trim(),
        document_operation: operations,
        select_template: templateFile,
        workflow,
        trainingRequired,
        visible_to_users: selectedUsers,
      }).unwrap(); // Use unwrap() to catch errors in the mutation

      toast.success("Document updated successfully!");
      setTimeout(() => navigate("/document-listing"), 1500);
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document. Please try again.");
    }
  };
  

  const handleClear = () => {
    setTitle("");
    setType("");
    setDocumentNumber("");
    setDescription("");
    setRevisionTime("");
    setOperations("Upload files");
    setWorkflow("");
    setTrainingRequired("No");
    setTemplateFile(null);
    setErrors({});
  };

  const handleFileChange = (e) => {
    setTemplateFile(e.target.files[0]);
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
                type="Date"
                label="Revision Date"
                value={revisionTime}
                InputLabelProps={{
                  shrink: true,
                }}
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
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-user-label">Update Users</InputLabel>
                <Select
                  labelId="select-user-label"
                  id="select-user"
                  multiple // Enable multiple selection
                  value={selectedUsers} // Use state to hold selected users
                  onChange={(e) => setSelectedUsers(e.target.value)} // Update the selected users
                  input={<OutlinedInput label="Update Users" />}
                  sx={{
                    minWidth: 200,
                    height: "3rem",
                    ".MuiSelect-select": { padding: "0.45rem" },
                  }}
                  renderValue={(selected) =>
                    selected
                      .map((userId) => {
                        const user = users.find((u) => u.id === userId);
                        return user?.first_name || userId;
                      })
                      .join(", ")
                  }
                >
                  {users.length > 0 ? (
                    users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.first_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No users available</MenuItem>
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

      {/* E-Signature Dialog */}
      <ESignatureDialog
        open={openSignatureDialog}
        onClose={() => setOpenSignatureDialog(false)}
        onConfirm={handleSignatureComplete}
      />

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </BasicLayout>
  );
}

export default EditDocument;
