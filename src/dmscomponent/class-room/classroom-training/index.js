import React, { useState } from "react";
import {
  Card,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import ESignatureDialog from "layouts/authentication/ESignatureDialog"; // Ensure correct import
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import MDInput from "components/MDInput";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ClassroomTraining() {
  const [trainingType, setTrainingType] = useState("");
  const [classroomTitle, setClassroomTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Assigned");
  const [File, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    const newErrors = {};
    if (!classroomTitle.trim()) newErrors.classroomTitle = "Classroom Title is required.";
    if (!trainingType) newErrors.trainingType = "Training Type is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!File) newErrors.File = "File upload is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    setOpenSignatureDialog(true); // Open e-signature dialog
  };

  const handleClear = () => {
    setClassroomTitle("");
    setTrainingType("");
    setDescription("");
    setStatus("Assigned");
    setFile(null);
    setErrors({});
    toast.info("Form cleared successfully.");
  };

  const handleSignatureComplete = async (password) => {
    setOpenSignatureDialog(false);
    if (!password) {
      toast.error("E-Signature is required to proceed.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("classroom_name", classroomTitle.trim());
    formData.append("is_assesment", trainingType);
    formData.append("description", description.trim());
    formData.append("status", status);
    formData.append("upload_doc", File);

    const token = sessionStorage.getItem("token");
    const apiUrl = `${process.env.REACT_APP_APIKEY}lms_module/create_classroom`;

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        toast.success("Classroom training created successfully!");
        setTimeout(() => navigate("/class-room"), 1500); 
      } else {
        toast.error(response.data.message || "Failed to create classroom training.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred while creating the classroom training."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrors((prev) => ({ ...prev, File: "" })); 
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
            Classroom Training
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MDInput
                  type="text"
                  label={<><span style={{ color: "red" }}>*</span> Classroom Title</>}
                  fullWidth
                  value={classroomTitle}
                  onChange={(e) => setClassroomTitle(e.target.value)}
                  error={!!errors.classroomTitle}
                  helperText={errors.classroomTitle}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="dense" error={!!errors.trainingType}>
                  <InputLabel id="training-type-label">
                    <span style={{ color: "red" }}>*</span> Type
                  </InputLabel>
                  <Select
                    labelId="training-type-label"
                    id="training-type"
                    value={trainingType}
                    onChange={(e) => setTrainingType(e.target.value)}
                    input={<OutlinedInput label="Type" />}
                    sx={{
                      minWidth: 200,
                      height: "3rem",
                      ".MuiSelect-select": { padding: "0.45rem" },
                    }}
                  >
                    <MenuItem value="With Assessment">With Assessment</MenuItem>
                    <MenuItem value="Without Assessment">Without Assessment</MenuItem>
                  </Select>
                </FormControl>
                {errors.trainingType && (
                  <MDTypography variant="caption" color="error">
                    {errors.trainingType}
                  </MDTypography>
                )}
              </Grid>
              <Grid item xs={12}>
                <MDInput
                  label={<><span style={{ color: "red" }}>*</span> Description</>}
                  multiline
                  rows={4}
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    input={<OutlinedInput label="Status" />}
                    sx={{
                      minWidth: 200,
                      height: "3rem",
                      ".MuiSelect-select": { padding: "0.45rem" },
                    }}
                  >
                    <MenuItem value="Assigned">Assigned</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <MDInput
                  type="file"
                  label={<><span style={{ color: "red" }}>*</span> Upload File</>}
                  fullWidth
                  onChange={handleFileChange}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: ".pdf,.ppt,.doc,.docx" }}
                  error={!!errors.File}
                  helperText={errors.File}
                />
              </Grid>
            </Grid>

            <MDBox mt={2} mb={1}>
              <MDButton
                variant="gradient"
                color="submit"
                fullWidth
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Submit"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* Toast Container */}
      <ToastContainer />

      {/* E-Signature Dialog */}
      <ESignatureDialog
        open={openSignatureDialog}
        onClose={() => setOpenSignatureDialog(false)}
        onConfirm={handleSignatureComplete}
      />
    </BasicLayout>
  );
}

export default ClassroomTraining;
