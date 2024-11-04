// AddTraining.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, MenuItem, TextField, IconButton, List, ListItem, ListItemText } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import ESignatureDialog from "layouts/authentication/ESignatureDialog";
import DeleteIcon from "@mui/icons-material/Delete";

function AddTraining() {
  const [plantName, setPlantName] = useState("");
  const [trainingTitle, setTrainingTitle] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [trainingVersion, setTrainingVersion] = useState("");
  const [trainingNumber, setTrainingNumber] = useState("");
  const [refresherTime, setRefresherTime] = useState("");
  const [methodology, setMethodology] = useState("");
  const [documents, setDocuments] = useState([]);
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setDocuments([...documents, ...e.target.files]);
  };

  const handleRemoveDocument = (index) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpenSignatureDialog(true);
    console.log("Training Details Submitted:", { 
      plantName, trainingTitle, trainingType, trainingVersion, 
      trainingNumber, refresherTime, methodology, documents 
    });
  };

  const handleClear = () => {
    setPlantName("");
    setTrainingTitle("");
    setTrainingType("");
    setTrainingVersion("");
    setTrainingNumber("");
    setRefresherTime("");
    setMethodology("");
    setDocuments([]);
  };

  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false);
    navigate("/dashboard");
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
            Add Training
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
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Plant Name"
                fullWidth
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Training Title"
                fullWidth
                value={trainingTitle}
                onChange={(e) => setTrainingTitle(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <TextField
                select
                label="Training Type"
                fullWidth
                value={trainingType}
                onChange={(e) => setTrainingType(e.target.value)}
              >
                <MenuItem value="Technical">Technical</MenuItem>
                <MenuItem value="Safety">Safety</MenuItem>
                <MenuItem value="Operational">Operational</MenuItem>
              </TextField>
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Training Version"
                fullWidth
                value={trainingVersion}
                onChange={(e) => setTrainingVersion(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Training Number"
                fullWidth
                value={trainingNumber}
                onChange={(e) => setTrainingNumber(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Refresher Time"
                fullWidth
                value={refresherTime}
                onChange={(e) => setRefresherTime(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Methodology"
                fullWidth
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="file"
                label="Upload Documents"
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ multiple: true }}
                onChange={handleFileChange}
              />
              <List>
                {documents.map((file, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveDocument(index)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={file.name} />
                  </ListItem>
                ))}
              </List>
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit">
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* E-Signature Dialog */}
      <ESignatureDialog
        open={openSignatureDialog}
        handleClose={handleCloseSignatureDialog}
      />
    </BasicLayout>
  );
}

export default AddTraining;
