import React, { useState, useRef } from "react";
import { Box, Button, Paper, Typography } from '@mui/material';
import Editor from './Editor';
import PropTypes from 'prop-types';

const DocumentView = ({ addComment, comments }) => {
  const [selectedText, setSelectedText] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [highlights, setHighlights] = useState([]); 
  const quillRef = useRef(null);
  const readOnly = false;

  const handleTextSelection = () => {
    const selection = window.getSelection().toString();
    setSelectedText(selection);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (selectedText) {
      const comment = prompt("Add your comment:");
      if (comment) {
        addComment(comment, selectedText);
        setHighlights((prev) => [...prev, { text: selectedText, comment }]);
        setSelectedText("");
      }
    }
  };

  const getHighlightedText = (text) => {
    const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    highlights.forEach((highlight) => {
      const escapedSelection = escapeRegExp(highlight.text);
      const regex = new RegExp(`(${escapedSelection})`, 'gi');
      text = text.replace(
        regex,
        `<mark style="background-color: yellow">$1</mark>`
      );
    });
    return { __html: text };
  };

  const handleTextChange = (content) => {
    if (typeof content === 'string') {
      setDocumentContent(content);
    } else if (content && typeof content === 'object') {
      setDocumentContent(content.html || ""); 
    }
  };

  const handleSave = () => {
    console.log("Document Saved:", documentContent);
  };

  const handleView = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box display="flex" gap={1} marginBottom={2} sx={{ position: 'sticky', top: 0, backgroundColor: '#2d2d2d', color: 'white', padding: 1, zIndex: 10 }}>
        <Button variant="contained" onClick={handleSave}>Save</Button>
        <Button variant="contained" onClick={handleView}>View</Button>
        <Button variant="contained" onClick={handlePrint}>Print</Button>
      </Box>

      <Box 
        flex={1} 
        onMouseUp={handleTextSelection} 
        onContextMenu={handleContextMenu} 
        sx={{ overflowY: 'auto', border: '1px solid #ccc', backgroundColor: 'white', padding: 2 }}
      >
        <Editor
          ref={quillRef}
          readOnly={readOnly}
          defaultValue={documentContent}
          onSelectionChange={handleTextSelection}
          onTextChange={handleTextChange}
        />
      </Box>

      {isPopupOpen && (
        <Box 
          position="fixed" 
          top={0} 
          left={0} 
          width="100%" 
          height="100%" 
          bgcolor="rgba(0, 0, 0, 0.5)" 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          zIndex={1000}
        >
          <Paper 
            elevation={3} 
            sx={{ width: '190mm', height: '180mm', position: 'relative', padding: 2 }}
          >
            <Typography 
              variant="h6" 
              onClick={closePopup} 
              sx={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
            >
              &times;
            </Typography>
            <Box position="relative">
              <Typography 
                variant="h1" 
                sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '100px', color: 'rgba(0, 0, 0, 0.1)', pointerEvents: 'none' }}
              >
                pending
              </Typography>
              <Box dangerouslySetInnerHTML={getHighlightedText(documentContent)} />
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

DocumentView.propTypes = {
  addComment: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default DocumentView;
