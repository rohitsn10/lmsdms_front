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
import SendBackDialog from "./sendback";
import ConditionalDialog from "./effective";
import { useDocumentSendBackStatusMutation } from "api/auth/texteditorApi";
import { useFetchDocumentsQuery} from "api/auth/documentApi";

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
  // ["view-comments"], // Custom view comments button
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
  const [documentReviewStatus] = useDocumentReviewStatusMutation();
  const navigate = useNavigate();
  const [documentApproveStatus] = useDocumentApproveStatusMutation();
  const [ documentSendBackStatus] = useDocumentSendBackStatusMutation();
  const searchParams = new URLSearchParams(location.search);
  const document_current_status = searchParams.get("status");
  const trainingRequired = searchParams.get("training_required");
  const [dialogeffectiveOpen, setDialogeffectiveOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // Manage dialog visibility
  const [assignedTo, setAssignedTo] = useState(''); // State for Assigned To dropdown
  const [statusSendBack, setStatusSendBack] = useState(''); // State for Status Send Back dropdown
  // console.log("Navigated with data in text Editor :", { id, document_current_status});
  // console.log("Training Required:", trainingRequired)
  const { data: documentsData, isLoading: isDocumentsLoading } = useFetchDocumentsQuery();

  // Log the documentsData structure
  console.log('Documents Data:', documentsData);
  
  // Extract userGroupIds directly from documentsData
  const userGroupIds = documentsData?.userGroupIds || [];
  console.log('Extracted User Group IDs:', userGroupIds);
  
  // Visibility function using extracted userGroupIds
  const isButtonVisible = (requiredGroupIds) => {
    console.log('Checking visibility for groups:', requiredGroupIds, 'against user groups:', userGroupIds);
    return requiredGroupIds.some((id) => userGroupIds.includes(id));
  };
  

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
              // "view-comments": handleOpenCommentsDrawer, // Correct handler for viewing comments
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
      const response = await documentApproveStatus({
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
    console.log("Id passed:", id);
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
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Handle dialog confirm
  const handleConfirmDialog = async () => {
    console.log("Send Back button clicked");
  
    try {
      // Call the API using the mutation hook and pass the required data directly
      const response = await documentSendBackStatus({
        document_id: id, // Replace with your actual document_id
        assigned_to: assignedTo, // Value from the dialog's state
        status_sendback: "8", // The current status (replace with actual status if needed)
      }).unwrap();
  
      console.log("API Response:", response);
      if (response.status) {
        alert(response.message); // Success message from the API response
        setDialogOpen(false); // Close dialog on success
        navigate("/document-listing"); // Navigate to document listing page
      } else {
        alert("Action failed. Please try again."); // Failure alert
      }
    } catch (error) {
      console.error("Error calling API:", error);
      alert("An error occurred. Please try again."); // General error handling
    }
  };

  const handleDialogConfirm = async () => {
    setDialogeffectiveOpen(false); // Close the dialog after confirmation
  
    console.log("Doc Admin Approve clicked - Confirmed");
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
  

  const handleDialogOpen = () => {
    console.log("Doc Admin Approve clicked - Confirmed");
    setDialogeffectiveOpen(true); // Open the dialog
  };

  const handleDialogClose = () => {
    setDialogeffectiveOpen(false); // Close the dialog
  };

  const handleConfirmSave = async () => {
    const content = quillRef.current.root.innerHTML;
    const documentData = { document_id: id, document_data: content };
  
    // Save the document data (existing functionality)
    await createDocument(documentData);
  
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
        documentId={id}
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

        {/* Condition 1: Show Submit and Save Draft buttons when status is "1" or "2" */}
        {(document_current_status === "1" || document_current_status === "2") && isButtonVisible([2]) && (
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
        {document_current_status === "3" && isButtonVisible([2]) &&  (
          <>
            <MDButton variant="gradient" color="submit" onClick={handleReview} disabled={isLoading}>
              Review
            </MDButton>
            <MDButton
              variant="gradient"
              color="error" // Change color to indicate sending back
              onClick={handleOpenDialog}
              disabled={isLoading}
            >
              Send Back
            </MDButton>
          </>
        )}

        {/* Condition 3: Show Approve button when status is "4" */}
        {document_current_status === "4"  && isButtonVisible([7]) && (
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
              onClick={handleOpenDialog}
              color="error"
              disabled={isLoading}
            >
              Send Back
            </MDButton>
          </>
        )}
  {/* Condition 4 */}
        {document_current_status === "5"  && isButtonVisible([8]) && (
          <>
            <MDButton variant="gradient" color="submit" onClick={handleDialogOpen} disabled={isLoading}>
              Doc Admin Approve
            </MDButton>
            <MDButton
              variant="gradient"
              color="error"
              onClick={handleOpenDialog}
              disabled={isLoading}
            >
              Send Back
            </MDButton>
          </>
        )}
      
        {/* Display success or error messages */}
        {data && <p>{data.message}</p>}
        {error && <p>Error: {error.message}</p>}
        <MDButton
        variant="gradient"
        color="submit"
        onClick={handlePrint} // Use onClick to trigger navigation
        sx={{
          float: "right",
          mt: 1,
          mr: 20,
        }}
      >
        Print
      </MDButton>
      </MDBox>
      <SendBackDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDialog}
        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}
        statusSendBack={statusSendBack}
        setStatusSendBack={setStatusSendBack}
        documentId={id}
      />
       <ConditionalDialog
        open={dialogeffectiveOpen}
        onClose={handleDialogClose} // Handle dialog close
        onConfirm={handleDialogConfirm} // Handle dialog confirmation
        trainingStatus={trainingRequired} // Pass trainingRequired as trainingStatus
      />
    </Box>
  );
};

export default DocumentView;
