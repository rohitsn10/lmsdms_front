import React, { useState } from "react";
import PropTypes from "prop-types";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  TextField, 
  Button, 
  Snackbar, 
  Alert, 
  MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import apiService from "services/apiService";
import { useNavigate } from "react-router-dom";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const AddMaterialModal = ({ open, handleClose, sectionId, handleSubmit }) => {
    const navigate = useNavigate();
    console.log("SectionID:",sectionId)
  const [material, setMaterial] = useState({
    material_title: '',
    material_type: '',
    minimum_reading_time: '',
    file: null,
    section_id: sectionId
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterial((prevMaterial) => ({
      ...prevMaterial,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMaterial((prevMaterial) => ({
        ...prevMaterial,
        file: file,
      }));
    }
  };

  const handleFormSubmit = async(e) => {
    e.preventDefault();
    let hasError = false;
    let errorMessage = "";
    console.log("Noewoe")
    if (!material.material_title) {
      hasError = true;
      errorMessage = "Material Title is required";
    }
    if (!material.material_type) {
      hasError = true;
      errorMessage = "Material Type is required";
    }
    if (!material.minimum_reading_time) {
      hasError = true;
      errorMessage = "Reading time is required";
    }
    if (!material.file) {
      hasError = true;
      errorMessage = "File is required";
    }

    if (hasError) {
      setOpenSnackbar(true);
      setErrorMessage(errorMessage);
      return;
    }
    // console.log(material.material_title,material.material_type,material.minimum_reading_time,material.section_id,material.file)
    const formData = new FormData();
    formData.append('material_title', material.material_title);
    formData.append('material_type', material.material_type);
    formData.append('minimum_reading_time', material.minimum_reading_time);
    formData.append('section_ids', material.section_id);
    formData.append('material_file', material.file);
    // console.log(formData);

    try {
        // Make the POST request using your Axios inst
        // ance
        const response = await apiService.post('/lms_module/create_training_material', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Set proper content type
          },
        });
    
        // console.log('Response:', response.data);
        // Reset form and close modal
        setMaterial({
          material_title: '',
          material_type: '',
          minimum_reading_time: '',
          file: null,
          section_id: sectionId,
        });
        navigate(0);

        handleClose();
        // navigate(0);
      } catch (error) {
        console.error('Error creating training material:', error);
        setOpenSnackbar(true);
        setErrorMessage('Failed to create training material. Please try again.');
      }
    // handleSubmit(formData);
    setMaterial({
      material_title: '',
      material_type: '',
      minimum_reading_time: '',
      file: null,
      section_id: sectionId
    });
    handleClose();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        open={open}
        aria-labelledby="add-material-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="add-material-dialog-title" sx={{ m: 0, p: 2 }}>
          Add New Material
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Material Title"
              name="material_title"
              value={material.material_title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              select
              label="Material Type"
              name="material_type"
              value={material.material_type}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                sx: {
                  height: 50,
                  fontSize: "1rem",
                  padding:'20px'
                },
              }}
              SelectProps={{
                sx: {
                  padding: "10px",
                },
              }}
              required
            >
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="document">Document</MenuItem>
            </TextField>

            <TextField
              label="Minimum Reading Time (minutes)"
              name="minimum_reading_time"
              value={material.minimum_reading_time}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
              required
              InputProps={{ inputProps: { min: 1 } }}
              sx={{
                height:50
              }}
              
            />

            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{
                marginTop: 2,
                marginBottom: 1,
                backgroundColor: material.file ? "#4caf50" : undefined
              }}
            >
              {material.file ? material.file.name : "Upload File"}
              <VisuallyHiddenInput 
                type="file" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.mp4,.avi,.mov"
              />
            </Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                marginTop: 2,
                backgroundColor: "#31AC47",
                "&:hover": {
                  backgroundColor: "#1ebf39",
                },
              }}
            >
              Add Material
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

AddMaterialModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  sectionId: PropTypes.number.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default AddMaterialModal;