import React, { useState } from "react";
import { Card, MenuItem, TextField, Grid, CircularProgress } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import MDButton from "components/MDButton";
import axios from "axios";
import config from "constants/config";
import MDInput from "components/MDInput";

function ClassroomTraining() {
  const [trainingType, setTrainingType] = useState("");
  const [classroomTitle, setClassroomTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Assigned");
  const [File, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token"); 
    const apiUrl = `${process.env.REACT_APP_APIKEY}lms_module/create_classroom`; 
    // Validate required fields
    if (!classroomTitle || !trainingType || !description || !status) {
      setIsError(true);
      setError("All fields are required. Please complete the form.");
      return;
    }

    const formData = new FormData();
    formData.append("classroom_name", classroomTitle);
    formData.append("is_assesment", trainingType);
    formData.append("description", description);
    formData.append("status", status);


    if (File) {
      formData.append("upload_doc", File);
    } else {
      setIsError(true);
      setError("Please upload a file.");
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        setIsSuccess(true);
        console.log("Classroom training created successfully:", response.data);
      } else {
        setIsError(true);
        setError(response.data.message || "Failed to create classroom training.");
      }
    } catch (error) {
      // Handle errors
      setIsError(true);
      setError(error.response?.data?.message || error.message || "An error occurred.");
      console.error("Error creating classroom:", error);
    } finally {
      setIsLoading(false);
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
                    label="Upload file"
                    fullWidth
                    onChange={handleFileChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ accept: ".pdf,.ppt,.doc,.docx" }}
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

        {isSuccess && (
          <MDTypography color="success.main" mt={2}>
            Classroom training created successfully!
          </MDTypography>
        )}
        {isError && (
          <MDTypography color="error.main" mt={2}>
            Error: {error}
          </MDTypography>
        )}
      </Card>
    </BasicLayout>
  );
}

export default ClassroomTraining;
