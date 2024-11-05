// TrainingMapping.js
import React, { useState } from "react";
import {
  Card,
  MenuItem,
  TextField,
  IconButton,
  List,
  ListItem,
  Button,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import DeleteIcon from "@mui/icons-material/Delete";

function TrainingMapping() {
  const [selectedTraining, setSelectedTraining] = useState("");
  const [selectedPlant, setSelectedPlant] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [jobRoles, setJobRoles] = useState([]);
  const [bulkUploadFile, setBulkUploadFile] = useState(null);

  const handleAddJobRole = () => {
    if (selectedTraining) {
      setJobRoles([...jobRoles, selectedTraining]);
      setSelectedTraining("");
    }
  };

  const handleRemoveJobRole = (role) => {
    setJobRoles(jobRoles.filter((jobRole) => jobRole !== role));
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    setBulkUploadFile(file);
    // Implement bulk upload logic here
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trainingMappingData = {
      training: selectedTraining,
      plant: selectedPlant,
      department: selectedDepartment,
      area: selectedArea,
      jobRoles: jobRoles,
      bulkUploadFile: bulkUploadFile,
    };
    console.log("Training Mapping Data:", trainingMappingData);
    // Implement further submission logic here
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
            Training Mapping
          </MDTypography>
        </MDBox>

        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <TextField
                select
                label="Select Training"
                fullWidth
                value={selectedTraining}
                onChange={(e) => setSelectedTraining(e.target.value)}
              >
                <MenuItem value="Training 1">Training 1</MenuItem>
                <MenuItem value="Training 2">Training 2</MenuItem>
                <MenuItem value="Training 3">Training 3</MenuItem>
              </TextField>
            </MDBox>

            <MDBox mb={3}>
              <TextField
                select
                label="Select Plant"
                fullWidth
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
              >
                <MenuItem value="Plant A">Plant A</MenuItem>
                <MenuItem value="Plant B">Plant B</MenuItem>
              </TextField>
            </MDBox>

            <MDBox mb={3}>
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
            </MDBox>

            <MDBox mb={3}>
              <TextField
                select
                label="Select Area"
                fullWidth
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <MenuItem value="Area 1">Area 1</MenuItem>
                <MenuItem value="Area 2">Area 2</MenuItem>
              </TextField>
            </MDBox>

            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium">
                Job Roles
              </MDTypography>
              <List>
                {jobRoles.map((role, index) => (
                  <ListItem key={index}>
                    <MDTypography variant="body2">{role}</MDTypography>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveJobRole(role)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <MDInput
                type="text"
                label="Add Job Role"
                fullWidth
                value={selectedTraining}
                onChange={(e) => setSelectedTraining(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddJobRole}>
                Add
              </Button>
            </MDBox>

            <MDBox mb={3}>
              <MDInput
                type="file"
                label="Bulk Upload Job Roles"
                fullWidth
                inputProps={{ accept: ".csv,.xlsx" }}
                onChange={handleBulkUpload}
              />
            </MDBox>

            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit">
                Map Training
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default TrainingMapping;
