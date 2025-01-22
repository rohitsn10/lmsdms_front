import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";
import ReactPlayer from "react-player"; // For video rendering
import PropTypes from "prop-types";

const ViewFileModal = ({ open, handleClose, material }) => {
  const renderContent = () => {
    if (material.material_type === "pdf") {
      return (
        <iframe
          src={material.material_file_url}
          width="100%"
          height="500px"
          title="PDF Viewer"
        />
      );
    } else if (material.material_type === "video") {
      return (
        <ReactPlayer
          url={material.material_file_url}
          controls
          width="100%"
          height="500px"
        />
      );
    } else {
      return <Typography>Unsupported file type</Typography>;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>View File</DialogTitle>
      <DialogContent>{renderContent()}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ViewFileModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    material: PropTypes.shape({
      material_type: PropTypes.string.isRequired,
      material_file_url: PropTypes.string.isRequired,
    }).isRequired,
  };

export default ViewFileModal;
