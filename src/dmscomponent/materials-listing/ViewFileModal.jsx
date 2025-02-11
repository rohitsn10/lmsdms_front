import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import ReactPlayer from "react-player"; // For video rendering
import PropTypes from "prop-types";

const ViewFileModal = ({ open, handleClose, material }) => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const pdfContainerRef = useRef(null);
  const fetchPdf = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching PDF: ${response.status}`);
      }
      const blob = await response.blob();
      setPdfBlob(blob); // Set the blob for preview
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };
  useEffect(() => {
    if (material.material_type === "pdf" && open) {
      console.log("Fetching PDF from URL:", material.material_file_url);
      fetchPdf(material.material_file_url); // Fetch and render the PDF
    }
  }, [material, open]);
  const renderPDFPreview = () => {
    if (pdfBlob && pdfContainerRef.current) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const pdfDataUrl = fileReader.result;
        console.log("PDF Data URL loaded, rendering...");
        const embed = document.createElement("embed");
        embed.src = pdfDataUrl;
        embed.type = "application/pdf";
        embed.width = "100%";
        embed.height = "500px";
        pdfContainerRef.current.innerHTML = "";
        pdfContainerRef.current.appendChild(embed);
      };
      fileReader.readAsDataURL(pdfBlob);
    }
  };
  useEffect(() => {
    if (pdfBlob) {
      console.log("Rendering PDF...");
      renderPDFPreview();
    }
  }, [pdfBlob]);
  const renderContent = () => {
    if (material.material_type === "pdf") {
      return (
        <div ref={pdfContainerRef}>
          <Typography>Loading PDF...</Typography>
        </div>
      );
    } else if (material.material_type === "video") {
      return <ReactPlayer url={material.material_file_url} controls width="100%" height="500px" />;
    } else if (material.material_type === "audio") {
      return (
        <audio controls width="100%">
          <source src={material.material_file_url} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
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
