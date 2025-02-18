import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import { renderAsync } from "docx-preview";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";

const LMSDocument = () => {
  const location = useLocation(); // Access the state passed via navigate
  const [docContent, setDocContent] = useState(null); // Blob for docx-preview
  const docxContainerRef = useRef(null);

  // Retrieve the document URL from the location state (documentView instead of templateDoc)
  const { documentView } = location.state || {};
  console.log("+++++++++++++++++++get in Dcoument View  +++++++++++++",documentView)
  // Load the .docx file dynamically based on the documentView URL
  useEffect(() => {
    if (documentView) {
      fetch(documentView)
        .then((response) => response.blob()) 
        .then((blob) => setDocContent(blob))
        .catch((error) => console.error("Error fetching document:", error));
    }
  }, [documentView]);

  // Render the .docx file using docx-preview
  useEffect(() => {
    if (docContent && docxContainerRef.current) {
      renderAsync(docContent, docxContainerRef.current).catch((error) =>
        console.error("Error rendering document:", error)
      );
    }
  }, [docContent]);

  return (
    <Box sx={{ padding: 2 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Document Viewer
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ marginTop: 2 }}>
        <Box
          ref={docxContainerRef}
          sx={{
            width: "794px",
            height: "950px",
            margin: "0 auto",
            border: "1px solid #ccc",
            overflowY: "auto",
            padding: 2,
            backgroundColor: "#fff",
          }}
        ></Box>
      </Box>
    </Box>
  );
};

export default LMSDocument;
