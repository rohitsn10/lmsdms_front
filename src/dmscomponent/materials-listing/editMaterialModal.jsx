import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogTitle, DialogContent, IconButton, TextField, Button, Snackbar, Alert, Typography, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditMaterialModal = ({ open, handleClose, materialData, handleSubmit }) => {
  const [material, setMaterial] = useState({
    material_title: '',
    material_type: '',
    minimum_reading_time: '',
    material_file_url: '',
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (materialData) {
      setMaterial({
        material_title: materialData.material_title || '',
        material_type: materialData.material_type || '',
        minimum_reading_time: materialData.minimum_reading_time || '',
        material_file_url: materialData.material_file_url || '',
      });
    }
  }, [materialData]); // Update material state whenever materialData changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterial((prevMaterial) => ({
      ...prevMaterial,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    let errorMessage = "";

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
    if (!material.material_file_url) {
      hasError = true;
      errorMessage = "File URL is required";
    }

    if (hasError) {
      setOpenSnackbar(true);
      setErrorMessage(errorMessage);
      return;
    }
    console.log(material)
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        open={open}
        aria-labelledby="edit-material-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="edit-material-dialog-title" sx={{ m: 0, p: 2 }}>
          Edit Material
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
            {/* Material Title */}
            <TextField
              label="Material Title"
              name="material_title"
              value={material.material_title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />

            {/* Material Type */}
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
                  height: 50, // Adjust height
                  fontSize: "1rem", // Adjust font size for better readability
                },
              }}
              SelectProps={{
                sx: {
                  padding: "10px", // Adjust padding inside the select
                },
              }}
              required
            >
              <MenuItem value="PDF">PDF</MenuItem>
              <MenuItem value="Video">Video</MenuItem>
              <MenuItem value="Document">Document</MenuItem>
            </TextField>

            {/* Minimum Reading Time */}
            <TextField
              label="Minimum Reading Time"
              name="minimum_reading_time"
              value={material.minimum_reading_time}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
              required
              InputProps={{ inputProps: { min: 1 } }}
            />

            {/* File URL */}
            <TextField
              label="File URL"
              name="material_file_url"
              value={material.material_file_url}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />

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
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert severity="error" onClose={handleCloseSnackbar}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

EditMaterialModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  materialData: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default EditMaterialModal;
