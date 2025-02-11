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
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const timerRef = useRef(null); // Store timer reference

  // Fetch PDF file
  const fetchPdf = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error fetching PDF: ${response.status}`);
      const blob = await response.blob();
      setPdfBlob(blob);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  // Start timer when modal opens
  useEffect(() => {
    if (open) {
      setTimeLeft(600); // Reset timer to 10 minutes
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            sendTimeExceededMessage();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current); // Stop timer when modal closes
    }
    return () => clearInterval(timerRef.current); // Cleanup on unmount
  }, [open]);

  // Backend request when timer ends
  const sendTimeExceededMessage = async () => {
    // try {
    //   const response = await fetch("https://your-backend-url.com/timer-expired", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       message: "User viewed the file for 10 minutes.",
    //       materialType: material.material_type,
    //       materialUrl: material.material_file_url,
    //       timestamp: new Date().toISOString(),
    //     }),
    //   });

    //   if (!response.ok) throw new Error("Failed to send timer message.");
    //   console.log("Timer message sent successfully!");
    // } catch (error) {
    //   console.error("Error sending timer message:", error);
    // }
  };

  // Render PDF preview
  useEffect(() => {
    if (pdfBlob && pdfContainerRef.current) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const embed = document.createElement("embed");
        embed.src = fileReader.result;
        embed.type = "application/pdf";
        embed.width = "100%";
        embed.height = "500px";
        pdfContainerRef.current.innerHTML = "";
        pdfContainerRef.current.appendChild(embed);
      };
      fileReader.readAsDataURL(pdfBlob);
    }
  }, [pdfBlob]);

  // Fetch PDF when modal opens
  useEffect(() => {
    if (open && material.material_type === "pdf") {
      fetchPdf(material.material_file_url);
    }
  }, [material, open]);

  // Format time MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Render content based on material type
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
      <DialogContent>
        {/* Timer Display */}
        <Typography variant="h6" sx={{ textAlign: "center", marginBottom: 2 }}>
          Time Left: {formatTime(timeLeft)}
        </Typography>
        {renderContent()}
      </DialogContent>
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
