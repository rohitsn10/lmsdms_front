import React, { useEffect, useState, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import Mammoth from "mammoth";
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Drawer,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useGetTemplateQuery, useCreateDocumentMutation } from "api/auth/texteditorApi";

// Register the ImageResize module
Quill.register("modules/imageResize", ImageResize);

// Toolbar options for the editor
const toolbarOptions = [
  [{ font: [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ size: ["small", "normal", "large", "huge"] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["link", "image", "video", "blockquote", "hr", "formula"],
  ["clean"],
  [{ indent: "-1" }, { indent: "+1" }],
  ["code-block"],
  ["comment"],
];

const DocumentView = () => {
  const [docContent, setDocContent] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const quillRef = useRef(null);
  const { id } = useParams();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [selectedRange, setSelectedRange] = useState(null);
  const [comments, setComments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const [createDocument, { isSuccess, isError }] = useCreateDocumentMutation(); // API mutation

  // Fetch template from the API
  const { data, error, isLoading } = useGetTemplateQuery(id);
  console.log("data", data);
  console.log("document Id: ", id);

  useEffect(() => {
    const fetchDocxFile = async () => {
      if (data?.template_url) {
        try {
          const response = await fetch(data.template_url);
          const arrayBuffer = await response.arrayBuffer();
          const result = await Mammoth.convertToHtml({ arrayBuffer });
          setDocContent(result.value);
          setIsLoaded(true);
        } catch (err) {
          console.error("Error converting DOCX to HTML:", err);
          setIsLoaded(true);
        }
      }
    };

    fetchDocxFile();
  }, [data]);

  useEffect(() => {
    if (isLoaded && !quillRef.current) {
      const quill = new Quill("#editor-container", {
        theme: "snow",
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              comment: () => handleAddComment(),
            },
          },
          imageResize: {},
        },
      });

      quillRef.current = quill;
      quill.clipboard.dangerouslyPasteHTML(docContent);

      comments.forEach(({ range }) => {
        quill.formatText(range.index, range.length, { background: "yellow" });
      });

      const commentButton = document.querySelector(".ql-comment");
      if (commentButton) {
        commentButton.innerHTML = "💬";
      }
    }
  }, [isLoaded, docContent, comments]);

  // Handle Ctrl+S to open save dialog
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        setOpenDialog(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAddComment = () => {
    const quill = quillRef.current;
    const range = quill.getSelection();
    if (range) {
      setSelectedRange(range);
      setOpenDrawer(true);
    } else {
      alert("Please select text to add a comment.");
    }
  };

  const handleSaveComment = () => {
    if (currentComment.trim() === "") return;
    const quill = quillRef.current;
    quill.formatText(selectedRange.index, selectedRange.length, { background: "yellow" });
    setComments([...comments, { range: selectedRange, comment: currentComment }]);
    setCurrentComment("");
    setOpenDrawer(false);
  };

  // Save the document API call
  const handleConfirmSave = async () => {
    const content = quillRef.current.root.innerHTML;
    const documentData = { document_id: id, document_data: content };
    await createDocument(documentData);
    setOpenDialog(false);
  };

  if (isLoading) {
    return <Box padding={2}>Loading document...</Box>;
  }
  if (error) {
    return <Box padding={2}>Error loading document</Box>;
  }

  return (
    <Box sx={{ fontFamily: "Arial, sans-serif", padding: 2, backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <Paper
        id="editor-container"
        sx={{
          width: "210mm",
          height: "297mm",
          border: "1px solid #ccc",
          backgroundColor: "#fff",
          padding: 2,
          borderRadius: 1,
          overflowY: "auto",
          margin: "20px auto",
          boxShadow: 2,
        }}
      />

      {/* Comment Drawer */}
      <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Box sx={{ width: 250, padding: 2, position: 'relative', height: '100%' }}>
          <Typography variant="h6">Add Comment</Typography>
          <TextField
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
            rows={4}
            multiline
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleSaveComment}
            sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}
            style={{ backgroundColor: "#E53471", color: "white" }}
          >
            Save Comment
          </Button>
        </Box>
      </Drawer>

      {/* Save Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Save Document</DialogTitle>
        <DialogContent>
          <DialogContentText>Do you want to save this document?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSave} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentView;
