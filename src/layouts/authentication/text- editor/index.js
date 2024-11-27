import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EditorContent, useEditor, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Mammoth from "mammoth";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";
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
import {
  useGetTemplateQuery,
  useCreateDocumentMutation,
  useDocumentReviewStatusMutation,
} from "api/auth/texteditorApi";
import CommentDrawer from "./Comments/CommentsDrawer"; // Adjusted import for CommentDrawer
import CommentModal from "./Comments/CommentDialog"; // Adjusted import for CommentModal
import { useCreateCommentMutation } from "api/auth/commentsApi";
import AntiCopyPattern from "layouts/authentication/text- editor/anti-copy/AntiCopyPattern";
import { useNavigate } from "react-router-dom";
import { useDraftDocumentMutation } from "api/auth/texteditorApi";
import { useDocumentApproveStatusMutation } from "api/auth/texteditorApi";
import { useDocumentApproverStatusMutation } from "api/auth/texteditorApi";
import { useDocumentDocadminStatusMutation } from "api/auth/texteditorApi";
import SendBackDialog from "./sendback";

import { useGetTemplateQuery, useCreateDocumentMutation } from "api/auth/texteditorApi";
import { useCreateCommentMutation } from "api/auth/commentsApi";

const CustomComment = Extension.create({
  name: "comment",
  addOptions() {
    return {
      comments: [],
    };
  },
  addAttributes() {
    return {
      comment: {
        default: null,
        renderHTML: (attributes) => ({
          "data-comment": attributes.comment,
        }),
      },
    };
  },
});

const AntiCopyPattern = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
        background: `
          repeating-linear-gradient(
            45deg,
            rgba(255,0,0,0.05) 0,
            rgba(255,0,0,0.05) 10px,
            transparent 10px,
            transparent 20px
          )
        `,
        opacity: 0.3,
        userSelect: "none",
      }}
    />
  );
};

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [docContent, setDocContent] = useState("");
  const [comments, setComments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [selectedRange, setSelectedRange] = useState(null);

  const [createDocument] = useCreateDocumentMutation();
  const [createComment] = useCreateCommentMutation();
  const { data, error, isLoading } = useGetTemplateQuery(id, {
    skip: !id,
  });
  const [draftDocument] = useDraftDocumentMutation();
  const [documentReviewStatus] = useDocumentReviewStatusMutation();
  const [documentApproverStatus] = useDocumentApproverStatusMutation();
  const [documentApproveStatus] = useDocumentApproveStatusMutation();
  const [documentDocadminStatus] = useDocumentDocadminStatusMutation();
  const searchParams = new URLSearchParams(location.search);
  const document_current_status = searchParams.get("status");
  const [dialogOpen, setDialogOpen] = useState(false); // Manage dialog visibility
  const [assignedTo, setAssignedTo] = useState(''); // State for Assigned To dropdown
  const [statusSendBack, setStatusSendBack] = useState(''); // State for Status Send Back dropdown

  useEffect(() => {
    const fetchDocxFile = async () => {
      if (data?.template_url) {
        try {
          const response = await fetch(data.template_url);
          const arrayBuffer = await response.arrayBuffer();
          const result = await Mammoth.convertToHtml({ arrayBuffer });
          setDocContent(result.value);
        } catch (err) {
          console.error("Error converting DOCX to HTML:", err);
        }
      }
    };

    fetchDocxFile();
  }, [data]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image,
      Link,
      Placeholder.configure({
        placeholder: "Start editing your document...",
      }),
      CustomComment,
    ],
    content: docContent,
  });

  // const handleConfirmSave = async () => {
  //   if (!editor) return;

  //   const content = editor.getHTML();
  //   const documentData = { document_id: id, document_data: content };

  //   await createDocument(documentData);

  //   const commentsObject = {};
  //   comments.forEach((comment, index) => {
  //     const key = comment.selectedText?.trim() || `comment-${index}`;
  //     commentsObject[key] = comment.comment;
  //   });

  //   await createComment({
  //     document: id,
  //     comment_description: commentsObject,
  //   });

  //   setOpenDialog(false);
  // };

  const handleSaveDraft = async () => {
    try {
      await draftDocument({ document_id: id, status_id: 2 }).unwrap();
      // Handle success (e.g., show success message)
      navigate("/document-listing");
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
        // documentdetails_id: '1',
        status: "3",
      }).unwrap();
      navigate("/document-listing");
      // console.log('API Response:', response);
      // alert('Document approved successfully!');
    } catch (err) {
      console.error("API Error:", err);
      alert("Failed to approve the document. Please try again.");
    }
  };
  const handleReview = async () => {
    console.log("Review button clicked");
    try {
      const response = await documentReviewStatus({
        document_id: id, // Replace with your actual document_id
        status: "4", // Replace with your desired status

      }).unwrap();
      navigate("/document-listing");
      console.log("API Response:", response);
      if (response.status) {
        alert(response.message); // Success message
      } else {
        alert("Action failed");
      }
    } catch (error) {
      console.error("Error calling API:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleApprove = async () => {
    console.log("Approve button clicked");
    try {
      const response = await documentApproverStatus({
        document_id: id, // Replace with your actual document_id
        status: "5", // Replace with your desired status
      }).unwrap();
      navigate("/document-listing");
      console.log("API Response:", response);
      if (response.status) {
        alert(response.message); // Success message
      } else {
        alert("Action failed");
      }
    } catch (error) {
      console.error("Error calling API:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleDoc = async () => {
    console.log("Doc click button ");
    try {
      const response = await documentDocadminStatus({
        document_id: id, // Replace with your actual document_id
        status: "6", // Replace with your desired status
      }).unwrap();
      navigate("/document-listing");
      console.log("API Response:", response);
      if (response.status) {
        alert(response.message); // Success message
      } else {
        alert("Action failed");
      }
    } catch (error) {
      console.error("Error calling API:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleAddComment = () => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");

    if (selectedText.trim()) {
      setSelectedRange({ from, to });
      setOpenCommentDialog(true);
    } else {
      alert("Please select text to add a comment.");
    }
  };
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Handle dialog confirm
  const handleConfirmDialog = () => {
    console.log('Assigned To:', assignedTo);
    console.log('Status Send Back:', statusSendBack);
    setDialogOpen(false); // Close dialog after confirmation
  };

  const handleSaveComment = () => {
    if (!currentComment.trim()) return;

    const selectedText = editor.state.doc.textBetween(selectedRange.from, selectedRange.to, " ");

    setComments([
      ...comments,
      {
        id: Date.now(),
        selectedText,
        comment: currentComment,
      },
    ]);

    editor.commands.setMark(CustomComment, { comment: currentComment });

    setCurrentComment("");
    setOpenCommentDialog(false);
  };

  const handlePrint = () => {
    console.log("Id passed:", id);
    navigate(`/print-document/${id}`);
  };

  const handleSaveAsDocx = async () => {
    if (!editor) return;

    const htmlContent = editor.getHTML();
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
  if (isLoading) return <Box padding={2}>Loading document...</Box>;
  if (error) return <Box padding={2}>Error loading document</Box>;

  return (
    <Box
      sx={{
        fontFamily: "Arial, sans-serif",
        padding: 2,
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
      }}
    >
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

      <Box
        sx={{
          width: "210mm",
          height: "297mm",
          margin: "20px auto",
          padding: 2,
          border: "1px solid #ccc",
          backgroundColor: "#fff",
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      <Dialog open={openCommentDialog} onClose={() => setOpenCommentDialog(false)}>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <textarea
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
            placeholder="Enter your comment"
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCommentDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveComment}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Save Document</DialogTitle>
        <DialogContent>
          <DialogContentText>Do you want to save this document & all comments?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <MDBox mt={2} display="flex" justifyContent="center" gap={2}>
        {/* Condition 1: Show Submit and Save Draft buttons when status is "1" or "2" */}
        {(document_current_status === "1" || document_current_status === "2") && (
          <>
            <MDButton
              variant="gradient"
              color="submit"
              type="button" // Set to "button" to prevent default form submission
              onClick={handleSubmit}
              disabled={isLoading} // Disable the button while the API call is in progress
            >
              {isLoading ? "Submitting..." : "Submit"}
            </MDButton>
            <MDButton
              variant="gradient"
              color="submit"
              onClick={handleSaveDraft}
              disabled={isLoading} // Disable button when mutation is in progress
            >
              Save Draft
            </MDButton>
          </>
        )}

        {/* Condition 2: Show Review button when status is "3" */}
        {document_current_status === "3" && (
          <>
            <MDButton variant="gradient" color="submit" onClick={handleReview} disabled={isLoading}>
              Review
            </MDButton>
            <MDButton
              variant="gradient"
              color="error" // Change color to indicate sending back
              onClick={handleConfirmDialog}
              disabled={isLoading}
            >
              Send Back
            </MDButton>
          </>
        )}

        {/* Condition 3: Show Approve button when status is "4" */}
        {document_current_status === "4" && (
          <>
            <MDButton
              variant="gradient"
              color="submit"
              onClick={handleApprove}
              disabled={isLoading}
            >
              Approve
            </MDButton>
            <MDButton
              variant="gradient"
              onClick={handleConfirmDialog}
              color="error"
              disabled={isLoading}
            >
              Send Back
            </MDButton>
          </>
        )}
        {document_current_status === "5" && (
          <>
            <MDButton variant="gradient" color="submit" onClick={handleDoc} disabled={isLoading}>
              Doc Admin Approve
            </MDButton>
            <MDButton
              variant="gradient"
              color="error"
              onClick={handleConfirmDialog}
              disabled={isLoading}
            >
              Send Back
            </MDButton>
          </>
        )}
        {/* Display success or error messages */}
        {data && <p>{data.message}</p>}
        {error && <p>Error: {error.message}</p>}
      </MDBox>
      <SendBackDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDialog}
        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}
        statusSendBack={statusSendBack}
        setStatusSendBack={setStatusSendBack}
      />
    </Box>
  );
};

export default DocumentView;
