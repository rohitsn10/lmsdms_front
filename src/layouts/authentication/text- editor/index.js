import React, { useEffect, useState, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import Mammoth from "mammoth";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";
import ReactDOM from "react-dom";
import CommentBankIcon from "@mui/icons-material/CommentBank";
import {
  Box,
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useGetTemplateQuery, useCreateDocumentMutation } from "api/auth/texteditorApi";
import CommentDrawer from "./Comments/CommentDialog";

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
  const [openDialog, setOpenDialog] = useState(false);
  const [createDocument, { isSuccess, isError }] = useCreateDocumentMutation();

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
        // Clear existing content
        commentButton.innerHTML = "";
  
        // Create an instance of the CommentBankIcon
        const commentIcon = document.createElement("span");
        ReactDOM.render(<CommentBankIcon fontSize="small" />, commentIcon);
  
        // Append the rendered icon to the button
        commentButton.appendChild(commentIcon);
      }
    }
  }, [isLoaded, docContent, comments]);
  

  // Save the document as DOCX
  const handleSaveAsDocx = async () => {
    const quill = quillRef.current;
    const htmlContent = quill.root.innerHTML;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const plainText = doc.body.innerText.split("\n");

    const docxDocument = new Document({
      sections: [
        {
          children: plainText.map((line) => new Paragraph(line)),
        },
      ],
    });

    Packer.toBlob(docxDocument).then((blob) => {
      saveAs(blob, "document.docx");
    });
  };

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
    setComments([...comments, { id: Date.now(), range: selectedRange, comment: currentComment }]);
    setCurrentComment("");
    setOpenDrawer(false);
  };

  const handleConfirmSave = async () => {
    const content = quillRef.current.root.innerHTML;
    const documentData = { document_id: id, document_data: content };
    await createDocument(documentData);
    setOpenDialog(false);
    handleSaveAsDocx();
  };

  const handleEditComment = (id, newComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id ? { ...comment, comment: newComment } : comment
      )
    );
  };

  if (isLoading) {
    return <Box padding={2}>Loading document...</Box>;
  }
  if (error) {
    return <Box padding={2}>Error loading document</Box>;
  }

  return (
    <Box
      sx={{
        fontFamily: "Arial, sans-serif",
        padding: 2,
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
      }}
    >
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
      <CommentDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        currentComment={currentComment}
        setCurrentComment={setCurrentComment}
        handleSaveComment={handleSaveComment}
        comments={comments}
        handleEditComment={handleEditComment}
      />

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
