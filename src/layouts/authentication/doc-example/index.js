import React, { useEffect, useState, useRef } from "react";
import { renderAsync } from "docx-preview";
import { Box, Button, AppBar, Toolbar, Typography } from "@mui/material";
import ReactQuill from "react-quill"; // Quill for editing
import "react-quill/dist/quill.snow.css"; // Quill styles

const DocumentViewer = () => {
  const [docContent, setDocContent] = useState(null); // Blob for docx-preview
  const [editableContent, setEditableContent] = useState(""); // Quill content
  const [isEditing, setIsEditing] = useState(false);
  const docxContainerRef = useRef(null);

  // Load .docx file for rendering
  useEffect(() => {
    fetch("/template.docx")
      .then((response) => response.blob())
      .then((blob) => setDocContent(blob));
  }, []);

  // Render .docx file using docx-preview
  useEffect(() => {
    if (docContent && docxContainerRef.current) {
      renderAsync(docContent, docxContainerRef.current);
    }
  }, [docContent]);

  // Extract content for editing (mockup example)
  const handleEdit = () => {
    setEditableContent("<p>Editable content here...</p>"); // Replace with extracted content
    setIsEditing(true);
  };

  // Save edited content (mockup example)
  const handleSave = () => {
    console.log("Edited content:", editableContent); // Save to backend or file
    setIsEditing(false);
  };

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
        {isEditing ? (
          <ReactQuill
            value={editableContent}
            onChange={setEditableContent}
            theme="snow"
            style={{ height: "400px" }}
          />
        ) : (
          <Box
            ref={docxContainerRef}
            sx={{
              width: "80%",
              height: "80vh",
              margin: "0 auto",
              border: "1px solid #ccc",
              overflowY: "auto",
              padding: 2,
              backgroundColor: "#fff",
            }}
          ></Box>
        )}
      </Box>

      <Box sx={{ marginTop: 2, textAlign: "center" }}>
        {isEditing ? (
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        ) : (
          <Button variant="contained" color="secondary" onClick={handleEdit}>
            Edit Document
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DocumentViewer;
