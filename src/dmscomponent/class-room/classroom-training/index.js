import React, { useState } from "react";
import { Card, MenuItem, TextField, Grid, CircularProgress } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import MDButton from "components/MDButton";
import { useCreateClassroomMutation } from "apilms/classRoomApi"; // Import the hook
import MDInput from "components/MDInput";
function ClassroomTraining() {
  const [trainingType, setTrainingType] = useState("");
  const [classroomTitle, setClassroomTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadDocument, setUploadDocument] = useState(null);
  const [status, setStatus] = useState("Assigned");
  const [createClassroom, { isLoading, isSuccess, isError, error }] = useCreateClassroomMutation();
  const [File, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a FormData object to handle the multipart data
    const formData = new FormData();
    formData.append("classroom_name", classroomTitle);
    formData.append("is_assesment", trainingType);
    formData.append("description", description);
    formData.append("status", status);
  
    // Append the file(s)
    if (File) {
      formData.append("files", File); // Ensure the key matches the backend's expected key
    }
  
    try {
      // Send the form data using the mutation hook
      const response = await createClassroom(formData).unwrap();
      if (response.status) {
        console.log("Classroom training created successfully:", response);
      } else {
        console.error("Failed to create classroom training:", response.message);
      }
    } catch (err) {
      console.error("Error creating classroom:", err);
    }
  };
  
  
  
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Classroom Title"
                  fullWidth
                  value={classroomTitle}
                  onChange={(e) => setClassroomTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Type"
                  fullWidth
                  value={trainingType}
                  onChange={(e) => setTrainingType(e.target.value)}
                  sx={{
                    height: "40px", // Set desired height here
                    "& .MuiInputBase-root": {
                      minHeight: "2.4265em",
                      height: "100%", // Ensures the inner select aligns with the specified height
                    },
                  }}
                >
                  <MenuItem value="With Assessment">With Assessment</MenuItem>
                  <MenuItem value="Without Assessment">Without Assessment</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="Status"
                  fullWidth
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{
                    height: "40px", // Set desired height here
                    "& .MuiInputBase-root": {
                      minHeight: "2.4265em",
                      height: "100%", // Ensures the inner select aligns with the specified height
                    },
                  }}
                >
                  <MenuItem value="Assigned">Assigned</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <MDBox mb={3}>
                  <MDInput
                    type="file"
                    label={
                      <>
                        <span style={{ color: "red" }}>*</span>Upload file
                      </>
                    }
                    fullWidth
                    onChange={handleFileChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ accept: ".pdf,.ppt,.doc,.docx" }}
                    error={!!errors.templateFile}
                    helperText={errors.templateFile}
                  />
                </MDBox>
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
                {isLoading ? <CircularProgress size={24} /> : "Create Classroom Training"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* Show Success or Error message */}
        {isSuccess && (
          <MDTypography color="success.main" mt={2}>
            Classroom training created successfully!
          </MDTypography>
        )}
        {isError && (
          <MDTypography color="error.main" mt={2}>
            Error: {error?.message}
          </MDTypography>
        )}
      </Card>
    </BasicLayout>
  );
}

export default ClassroomTraining;
