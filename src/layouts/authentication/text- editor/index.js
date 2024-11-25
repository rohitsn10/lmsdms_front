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
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
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
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { useGetTemplateQuery, useCreateDocumentMutation } from "api/auth/texteditorApi";
import CommentDrawer from "./Comments/CommentsDrawer"; // Adjusted import for CommentDrawer
import CommentModal from "./Comments/CommentDialog"; // Adjusted import for CommentModal
import { useCreateCommentMutation } from "api/auth/commentsApi";
import AntiCopyPattern from "layouts/authentication/text- editor/anti-copy/AntiCopyPattern";
import { useNavigate } from "react-router-dom";
import { useDraftDocumentMutation } from "api/auth/texteditorApi";
import { useDocumentApproveStatusMutation } from 'api/auth/texteditorApi';

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
  ["comment"], // Custom comment button
  ["view-comments"], // Custom view comments button
];

const DocumentView = () => {
  const [docContent, setDocContent] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const quillRef = useRef(null);
  const { id } = useParams();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [opencommentDialog, setOpencommentDialog] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [selectedRange, setSelectedRange] = useState(null);
  const [comments, setComments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [createDocument] = useCreateDocumentMutation();
  const [createComment] = useCreateCommentMutation();
  const { data, error, isLoading } = useGetTemplateQuery(id);
  const [draftDocument] = useDraftDocumentMutation();
  const navigate = useNavigate();
  const [documentApproveStatus] = useDocumentApproveStatusMutation();
  const searchParams = new URLSearchParams(location.search);
  const document_current_status = searchParams.get('status');
  const current_status_name = searchParams.get('statusName');
  console.log('Navigated with data:', { id, document_current_status, current_status_name });

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
              comment: handleAddComment, // Correct handler for adding comments
              "view-comments": handleOpenCommentsDrawer, // Correct handler for viewing comments
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

      // Add icons to the toolbar buttons
      const commentButton = document.querySelector(".ql-comment");
      const viewCommentsButton = document.querySelector(".ql-view-comments");

      if (commentButton) {
        commentButton.innerHTML = "";
        const commentIcon = document.createElement("span");
        ReactDOM.render(<CommentBankIcon fontSize="small" />, commentIcon);
        commentButton.appendChild(commentIcon);
      }

      if (viewCommentsButton) {
        viewCommentsButton.innerHTML = "";
        const viewIcon = document.createElement("span");
        ReactDOM.render(<PlaylistAddCheckIcon fontSize="small" />, viewIcon);
        viewCommentsButton.appendChild(viewIcon);
      }
    }
  }, [isLoaded, docContent, comments]);


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

  const handleOpenCommentsDrawer = () => {
    setOpenDrawer(true);
  };

  const handleSaveDraft = async () => {
    try {
      await draftDocument({ document_id: id, status_id: 11 }).unwrap();
      // Handle success (e.g., show success message)
      navigate('/document-listing');
    } catch (err) {
      // Handle error
      console.error(err);
    }
  };

  // Function to handle Submit (you can add your submit logic here)
  const handleSubmit = async () => {
    try {
      const response = await documentApproveStatus({
        document_id: id, 
        documentdetails_id: '1',
        status: '1',
      }).unwrap();
      navigate('/document-listing');
      console.log('API Response:', response);
      alert('Document approved successfully!');
    } catch (err) {
      console.error('API Error:', err);
      alert('Failed to approve the document. Please try again.');
    }
  };

  const handleAddComment = () => {
    const quill = quillRef.current;
    const range = quill.getSelection();
    if (range) {
      setSelectedRange(range);
      setOpencommentDialog(true); // Open modal instead of drawer
    } else {
      alert("Please select text to add a comment.");
    }
  };

  // const handleSaveComment = () => {
  //   if (currentComment.trim() === "") return;
  //   const quill = quillRef.current;
  //   quill.formatText(selectedRange.index, selectedRange.length, { background: "yellow" });
  //   setComments([...comments, { id: Date.now(), range: selectedRange, comment: currentComment }]);
  //   setCurrentComment("");
  //   setOpencommentDialog(false); // Close modal after saving
  // };

  const handleSaveComment = () => {
    if (currentComment.trim() === "") return;

    const quill = quillRef.current;

    // Extract the selected word based on the selected range
    const selectedText = quill.getText(selectedRange.index, selectedRange.length).trim();

    // If no text is selected, return early
    if (!selectedText) return;

    // Highlight the selected text (optional)
    quill.formatText(selectedRange.index, selectedRange.length, { background: "yellow" });

    // Add the selected word and comment to the comments array
    setComments([
      ...comments,
      { id: Date.now(), selectedWord: selectedText, range: selectedRange, comment: currentComment },
    ]);

    // Clear the comment input and close the dialog
    setCurrentComment("");
    setOpencommentDialog(false); // Close modal after saving
  };
  const handlePrint = () => {
    console.log("Id passed:",id)
    navigate(`/print-document/${id}`);
  };

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

  const handleConfirmSave = async () => {
    const content = quillRef.current.root.innerHTML;
    const documentData = { document_id: id, document_data: content };

    // Save the document data (existing functionality)
    await createDocument(documentData);

    // Prepare the comments data as an object where the key is the selected word and the value is the comment
    const commentsObject = {};

    comments.forEach((comment, index) => {
      console.log("Comment Object:", comment);

      // Ensure 'selectedWord' exists and is a valid string
      if (comment.selectedWord && comment.selectedWord.trim()) {
        const key = comment.selectedWord.trim(); // Use the selected word as the key
        commentsObject[key] = comment.comment; // Map the word to the comment
      } else {
        // Fallback if selectedWord is not available
        const fallbackKey = `comment-${index}`;
        commentsObject[fallbackKey] = comment.comment;
      }
    });

    console.log("Comments Object:", commentsObject); // Log the final object to verify the structure

    // Send comments data to the backend as a single object under 'comment_description'
    await createComment({
      document: id, // Document ID
      comment_description: commentsObject, // All comments as key-value pairs
    }).unwrap(); // Handle promise rejection

    // Close the dialog after saving
    setOpenDialog(false);

    // Save the document as a .docx file if needed
    handleSaveAsDocx();
  };

  const handleEditComment = (id, newComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id ? { ...comment, comment: newComment } : comment
      )
    );
    console.log("Edit comment clicked");
  };

  const handleSaveEdit = (id, newComment) => {
    // Check if the new comment is not empty
    if (newComment.trim() === "") return;

    // Update the comment in the state
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id ? { ...comment, comment: newComment } : comment
      )
    );

    // Close the modal or drawer after saving
    setOpenDrawer(false); // Close the drawer or modal after saving the comment
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
        position: "relative", // Ensure this container has a relative position
      }}
    >
      {/* Insert AntiCopyPattern as the background */}
      <AntiCopyPattern />
      <MDButton
      variant="gradient"
      color="submit"
      onClick={handlePrint} // Use onClick to trigger navigation
      sx={{
        float: "right",
        mt: 1,
        mr: 1,
      }}
    >
      Print
    </MDButton>
      <Paper
        id="editor-container"
        sx={{
          position: "relative", // Ensure editor is on top of the pattern
          width: "210mm",
          height: "297mm",
          border: "1px solid #ccc",
          // backgroundColor: "#fff",
          padding: 2,
          borderRadius: 1,
          overflowY: "auto",
          margin: "20px auto",
          boxShadow: 2,
        }}
      />

      <CommentDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        comments={comments}
        onAddCommentClick={handleAddComment}
        onEditCommentClick={handleEditComment}
        handleSaveEdit={handleSaveEdit}
      />

      <CommentModal
        open={opencommentDialog}
        onClose={() => setOpencommentDialog(false)}
        currentComment={currentComment}
        setCurrentComment={setCurrentComment}
        handleSaveComment={handleSaveComment}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Save Document</DialogTitle>
        <DialogContent>
          <DialogContentText>Do you want to save this document & All comments ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <MDBox mt={2} display="flex" justifyContent="center" gap={2}>
      <MDButton 
      variant="gradient" 
      color="submit" 
      type="button" // Set to "button" to prevent default form submission
      onClick={handleSubmit}
      disabled={isLoading} // Disable the button while the API call is in progress
    >
      {isLoading ? 'Submitting...' : 'Submit'}
    </MDButton>
      <MDButton
        variant="gradient"
        color="submit"
        onClick={handleSaveDraft}
        disabled={isLoading} // Disable button when mutation is in progress
      >
        Save Draft
      </MDButton>
      {data && <p>{data.message}</p>}
      {error && <p>Error: {error.message}</p>}
    </MDBox>
    </Box>
  );
};

export default DocumentView;
