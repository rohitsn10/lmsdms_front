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
            sx={{ width: '210mm', height: '297mm', position: 'relative', padding: 2, overflowY: 'auto', backgroundColor:'white'}} // A4 size
          >
            <Typography variant="h6" onClick={closePopup} sx={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}>
              &times;
            </Typography>
            <Box position="relative">
              <Typography variant="h4" sx={{ marginBottom: 2 }}>Document Template</Typography>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">Title:</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">Number:</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">Version Supersedes:</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">Department:</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">1.0 PURPOSE:</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">2.0 SCOPE:</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">3.0 RESPONSIBILITY:</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">4.0 ACCOUNTABILITY:</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">5.0 ABBREVIATION:</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">6.0 DEFINITIONS (IF ANY):</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">7.0 PROCEDURE:</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">8.0 ANNEXURE (IF ANY):</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">9.0 FORMAT (IF ANY):</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">10.0 TEMPLATE (IF ANY):</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">11.0 ACRONYMS (IF ANY):</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">12.0 REFERENCES (IF ANY):</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
              <Box component="div" sx={{ marginBottom: 2 }}>
                <Typography variant="body1">13.0 REVISION HISTORY (IF ANY):</Typography>
                <Editor
                  ref={quillRef}
                  readOnly={readOnly}
                  defaultValue=""
                  onTextChange={(content) => handleTextChange(content)}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

DocumentView.propTypes = {
  addComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
};

export default DocumentView;
