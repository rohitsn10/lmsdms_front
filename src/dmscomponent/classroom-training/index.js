// ClassroomTraining.js
import React, { useState } from "react";
import {
  Card,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import DeleteIcon from "@mui/icons-material/Delete";

function ClassroomTraining() {
  const [trainingType, setTrainingType] = useState("");
  const [classroomTitle, setClassroomTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [uploadDocument, setUploadDocument] = useState(null);
  const [selectedSOP, setSelectedSOP] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("Assigned");

  const handleSubmit = (e) => {
    e.preventDefault();
    const classroomTrainingData = {
      trainingType,
      classroomTitle,
      description,
      selectedDepartment,
      selectedEmployee,
      uploadDocument,
      selectedSOP,
      startDate,
      startTime,
      endTime,
      status,
    };
    console.log("Classroom Training Data:", classroomTrainingData);
    // Implement further submission logic here
  };

  const handleUploadDocument = (e) => {
    const file = e.target.files[0];
    setUploadDocument(file);
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
                  select
                  label="Classroom Training Type"
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
                  label="Classroom Title"
                  fullWidth
                  value={classroomTitle}
                  onChange={(e) => setClassroomTitle(e.target.value)}
                />
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
                  label="Select Department"
                  fullWidth
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <MenuItem value="Department 1">Department 1</MenuItem>
                  <MenuItem value="Department 2">Department 2</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="Select Employee"
                  fullWidth
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <MenuItem value="Employee 1">Employee 1</MenuItem>
                  <MenuItem value="Employee 2">Employee 2</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <input
                  type="file"
                  accept=".pdf,.ppt,.doc,.docx"
                  onChange={handleUploadDocument}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="SOP"
                  fullWidth
                  value={selectedSOP}
                  onChange={(e) => setSelectedSOP(e.target.value)}
                >
                  <MenuItem value="SOP 1">SOP 1</MenuItem>
                  <MenuItem value="SOP 2">SOP 2</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="date"
                  label="Start Date"
                  fullWidth
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="time"
                  label="Start Time"
                  fullWidth
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="time"
                  label="End Time"
                  fullWidth
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </Grid>

              <Grid item xs={6}>
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
            </Grid>

            <MDBox mt={2} mb={1}>
              <Button variant="contained" color="primary" fullWidth type="submit">
                Create Classroom Training
              </Button>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default ClassroomTraining;
