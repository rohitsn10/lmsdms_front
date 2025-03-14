import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
const ClassFileView = () => {
  const location = useLocation();
  const newRowData = location.state?.rowData || null;

  // Get the backend URL from environment variables
  const BASE_URL = process.env.REACT_APP_APIKEY 

  // Extract and construct the full PDF URL
  const pdfUrl = newRowData?.files?.length > 0 
    // ? `${BASE_URL.replace(/\/$/, "")}${newRowData.files[0].upload_doc}` // Ensure no double slashes
    ? `${newRowData.files[0].upload_doc}` // Ensure no double slashes
    : null;

  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pdfUrl) {
      fetch(pdfUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching PDF:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [pdfUrl]);

  return (
    <Box sx={{ width: "100%", textAlign: "center", marginTop: 2 }}>
      {loading ? (
        <CircularProgress />
      ) : blobUrl ? (
        <iframe src={blobUrl} width="800px" height="1000px" title="PDF Preview"></iframe>
      ) : (
        <Box sx={{ 
  display: "flex", 
  flexDirection: "column", 
  alignItems: "center", 
  justifyContent: "center", 
  height: "250px", // Increased height for better spacing
  width: "500px", 
  margin: "50px auto", // Centered horizontally & added top margin
  color: "#444", // Slightly darker text for better contrast
  backgroundColor: "#f9f9f9", // Softer background
  borderRadius: "12px", // Rounded corners for a modern look
  padding: "20px", // Added padding for spacing
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
  textAlign: "center" // Ensures text is properly centered
}}>
          <PictureAsPdfIcon sx={{ fontSize: 80, color: "#d32f2f" }} /> 
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            No PDF Available
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            It looks like this document is missing or has not been uploaded.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ClassFileView;
