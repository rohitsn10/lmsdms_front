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
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { Box } from "@mui/material";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import MDButton from "components/MDButton";
import {
  useGetTemplateQuery,
  useCreateDocumentMutation,
  useDocumentReviewStatusMutation,
  useDocumentDocadminStatusMutation,
} from "api/auth/texteditorApi";
import ESignatureDialog from "layouts/authentication/ESignatureDialog";
import CommentDrawer from "./Comments/CommentsDrawer"; // Adjusted import for CommentDrawer
import CommentModal from "./Comments/CommentDialog"; // Adjusted import for CommentModal
import { useCreateCommentMutation } from "api/auth/commentsApi";
import AntiCopyPattern from "layouts/authentication/text- editor/anti-copy/AntiCopyPattern";
import { useNavigate, useLocation } from "react-router-dom";
import { useDraftDocumentMutation } from "api/auth/texteditorApi";
import { useDocumentApproveStatusMutation } from "api/auth/texteditorApi";
import SendBackDialog from "./sendback";
import { useDocumentSendBackStatusMutation } from "api/auth/texteditorApi";
import { useFetchDocumentsQuery } from "api/auth/documentApi";
import { toast, ToastContainer } from "react-toastify";
import RemarkDialog from "./remark";
import SelectUserDialog from "./user-select";

Quill.register("modules/imageResize", ImageResize);
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
  const [documentSendBackStatus] = useDocumentSendBackStatusMutation();
  const [documentDocAdmin] = useDocumentDocadminStatusMutation();
  const searchParams = new URLSearchParams(location.search);
  const document_current_status = searchParams.get("status");
  const trainingRequired = searchParams.get("training_required");
  const approval_status = searchParams.get("approval_status");
  // const [dialogeffectiveOpen, setDialogeffectiveOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // Manage dialog visibility
  const [assignedTo, setAssignedTo] = useState(""); // State for Assigned To dropdown
  const [statusSendBack, setStatusSendBack] = useState(""); // State for Status Send Back dropdown
  console.log("Navigated with data in text Editor :", { id, document_current_status });
  // console.log("Training Required:", trainingRequired)
  const { data: documentsData, isLoading: isDocumentsLoading } = useFetchDocumentsQuery();
  const [randomNumber] = useState(Math.floor(Math.random() * 100000));
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [action, setAction] = useState("");
  const [openRemarkDialog, setOpenRemarkDialog] = useState(false);
  const [remark, setRemark] = useState(""); // Store entered remark
  // const [action, setAction] = useState(""); // To store the action like "submit", "approve", etc.
  const [openuserDialog, setOpenuserDialog] = useState(false);
  const [approver, setApprover] = useState("");
  const [reviewer, setReviewer] = useState([]);
  const [docAdmin, setDocAdmin] = useState("");

  console.log("-+-+-+-+-+-+-+-+-+-+-++--++--+",docAdmin);
  // Extract userGroupIds directly from documentsData
  const userGroupIds = documentsData?.userGroupIds || [];
  console.log("Extracted User Group IDs:", userGroupIds);

  // Visibility function using extracted userGroupIds
  const isButtonVisible = (requiredGroupIds) => {
    console.log(
      "Checking visibility for groups:",
      requiredGroupIds,
      "against user groups:",
      userGroupIds
    );
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
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        setOpenDialog(true);
      }
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        handlePrint2(); // Trigger the print function when Ctrl + P is pressed
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const handleRemarkConfirm = async (remark) => {
    // Close RemarkDialog and open E-Signature dialog
    setOpenRemarkDialog(false);
    setRemark(remark);
    console.log("-+-+-+-+-+-+-+-+-++-+-+-+--+-+", remark);
    // Now proceed to E-Signature dialog
    setOpenSignatureDialog(true);
  };

  const handleSignatureComplete = async (password) => {
    setOpenSignatureDialog(false);

    if (!password) {
      toast.error("E-Signature is required to proceed.");
      return;
    }

    try {
      let response;
      switch (action) {
        case "saveDraft":
          response = await draftDocument({ document_id: id, status_id: 2, remark }).unwrap();
          toast.success("Saved as Draft!");
          break;
          case "submit":
            response = await documentApproveStatus({document_id: id,status: "3",remark,visible_to_users: reviewer,approver,doc_admin: docAdmin}).unwrap();
            console.log("",)
            toast.success("Document Submitted!");
            break;
        case "review":
          response = await documentReviewStatus({ document_id: id, status: "4", remark }).unwrap();
          toast.success("Document Reviewed!");
          break;
        case "approve":
          response = await documentApproveStatus({ document_id: id, status: "9", remark }).unwrap();
          toast.success("Document Approved!");
          break;
        default:
          throw new Error("Invalid action");
      }

      // Navigate after success
      setTimeout(() => {
        navigate("/document-listing");
      }, 2000);
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to process the action. Please try again.");
    }
  };

  const handleSaveDraft = () => {
    setAction("saveDraft");
    setOpenSignatureDialog(true);
  };

  const handleSubmit = () => {
    setAction("submit");
    setOpenuserDialog(true);  
  };
  

  const handleReview = () => {
    setAction("review");
    setOpenRemarkDialog(true);
  };

  const handleApprove = () => {
    setAction("approve");
    setOpenRemarkDialog(true);
  };

  // const handleDoc = () => {
  //   setAction("docAdminApprove");
  //   setOpenSignatureDialog(true);
  // };

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
  const handleSaveComment = async () => {
    if (currentComment.trim() === "") return;

    const quill = quillRef.current;
    const selectedText = quill.getText(selectedRange.index, selectedRange.length).trim();
    if (!selectedText) return;

    // Highlight the selected text
    quill.formatText(selectedRange.index, selectedRange.length, { background: "yellow" });

    // Make sure documentId is available
    if (!id) {
      console.error("Document ID is missing!");
      return;
    }

    const newComment = {
      document: id, // Make sure document ID is passed correctly
      selected_word: selectedText, // Store the selected text
      comment_description: currentComment, // Store the added comment
    };

    try {
      const response = await createComment(newComment);

      if (response.status) {
        setComments([
          ...comments,
          {
            id: Date.now(),
            selectedWord: selectedText,
            comment: currentComment,
            document: id,
          },
        ]);
        setCurrentComment(""); // Clear the comment input
        setOpencommentDialog(false); // Close the dialog
      } else {
        console.error("Failed to save comment:", response.message);
      }
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  const handlePrint = () => {
    console.log("Id passed:", id);
    navigate(`/print-document/${id}`);
  };

  // const handleNewPrint = () => {
  //   console.log("New Print Function Triggered for ID:", id);
  // };
  const handlePrint2 = (copies = 2) => {
    const quill = quillRef.current; // Get the Quill instance
    const editorContent = quill.root.innerHTML; // Get the HTML content from the editor

    // Function to generate a unique number (you can customize this logic)
    const generateUniqueNumber = (index) => `Print No: ${Date.now()}-${index + 1}`;

    // Create a temporary hidden iframe to load the content and trigger print
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const iframeDocument = iframe.contentWindow.document;

    iframeDocument.open();
    iframeDocument.write(`
      <html>
        <head>
          <style>
            /* Add basic print styles */
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              margin: 0;
              font-size: 12px;
            }
            .copy-container {
              page-break-after: always; /* Ensures each copy starts on a new page */
            }
            .copy-container:last-child {
              page-break-after: auto; /* Prevents a page break after the last copy */
            }
            #editor-container {
              width: 100%;
              max-width: 210mm;
              margin: 0 auto;
              padding: 10px;
              background-color: #fff;
              border: 1px solid #ccc;
            }
            .print-header {
              text-align: center;
              margin-bottom: 20px;
              font-size: 14px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          ${Array.from({ length: copies })
            .map(
              (_, index) => `
              <div class="copy-container">
                <div class="print-header">${generateUniqueNumber(index)}</div>
                <div id="editor-container">${editorContent}</div>
              </div>
            `
            )
            .join("")}
        </body>
      </html>
    `);
    iframeDocument.close();

    iframe.onload = () => {
      // Wait for iframe to load, then focus and trigger the print dialog
      iframe.contentWindow.focus();
      iframe.contentWindow.print(); // Trigger print dialog
      document.body.removeChild(iframe); // Clean up iframe after printing
    };
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
        toast.success("Document Send Back Successfully!");
        setTimeout(() => {
          navigate("/document-listing");
        }, 2000);
      } else {
        alert("Action failed. Please try again."); // Failure alert
      }
    } catch (error) {
      console.error("Error calling API:", error);
      toast.error("Failed to Sendback. Please try again.");
    }
  };

  // const handleDialogConfirm = async () => {
  //   setDialogeffectiveOpen(false); // Close the dialog after confirmation

  //   console.log("Doc Admin Approve clicked - Confirmed");
  //   try {
  //     const response = await documentDocadminStatus({
  //       document_id: id, // Replace with your actual document_id
  //       status: "6", // Replace with your desired status
  //     }).unwrap();
  //     navigate("/document-listing");
  //     console.log("API Response:", response);
  //     if (response.status) {
  //       alert(response.message); // Success message
  //     } else {
  //       alert("Action failed");
  //     }
  //   } catch (error) {
  //     console.error("Error calling API:", error);
  //     alert("An error occurred. Please try again.");
  //   }
  // };

  const handleDialogOpen = () => {
    console.log("Doc Admin Approve clicked - Confirmed");
    setDialogeffectiveOpen(true); // Open the dialog
  };

  // const handleDialogClose = () => {
  //   setDialogeffectiveOpen(false); // Close the dialog
  // };

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

  const handleOpeusernDialog = () => {
    setOpenuserDialog(true);
  };

  const handleuserCloseDialog = () => {
    setOpenuserDialog(false);
    setOpenRemarkDialog(true);
  };
  const handleConfirmSelection = (selectedUsers) => {
  console.log("Selected Users:", selectedUsers);
  // Store selected users in state
  setApprover(selectedUsers.approver);
  setReviewer(selectedUsers.reviewer);
  setDocAdmin(selectedUsers.docAdmin);

  setOpenuserDialog(false); // Close the SelectUserDialog
  setOpenRemarkDialog(true); // Now open the RemarkDialog
};


  return (
    <MDBox
      sx={{
        fontFamily: "Arial, sans-serif",
        padding: 2,
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <AntiCopyPattern />

      <div
        id="editor-container"
        style={{
          width: "210mm",
          height: "297mm",
          margin: "20px auto",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "6px 12px",
            borderRadius: "5px",
            zIndex: 10, // Ensures it stays on top
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          #{randomNumber}
        </div>
      </div>

      <CommentDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        comments={comments}
        onAddCommentClick={handleAddComment}
        onEditCommentClick={handleEditComment}
        handleSaveEdit={handleSaveEdit}
        documentId={id}
      />

      <CommentModal
        open={opencommentDialog}
        onClose={() => setOpencommentDialog(false)}
        currentComment={currentComment}
        setCurrentComment={setCurrentComment}
        handleSaveComment={handleSaveComment}
      />

      <MDBox mt={2} display="flex" justifyContent="center" gap={2}>
        {/* Condition 1: Show Submit and Save Draft buttons when status is "1" or "2" */}
        {(document_current_status === "1" ||
          document_current_status === "2" ||
          document_current_status === "8") &&
          isButtonVisible([2]) && (
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
            </>
          )}
        {/* Condition 2: Show Review button when status is "3" */}
        {document_current_status === "3" && isButtonVisible([3]) && (
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
        {document_current_status === "4" && isButtonVisible([4]) && (
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
        {document_current_status === "5" && isButtonVisible([5]) && (
          <>
            {/* <MDButton variant="gradient" color="submit" onClick={handleDoc} disabled={isLoading}>
              Doc Admin Approve
            </MDButton> */}
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
          onClick={handleSaveDraft}
          disabled={isLoading} // Disable button when mutation is in progress
        >
          Save Draft
        </MDButton>
        <MDButton
          variant="gradient"
          color="submit"
          onClick={() => {
            handlePrint();
          }}
        >
          Print
        </MDButton>
      </MDBox>
      <MDBox
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        
        {/* import time line code  */}
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6} lg={4}>
            <OrdersOverview docId={id} />
          </Grid>
        </Grid>

        
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
      <ESignatureDialog
        open={openSignatureDialog}
        onClose={() => setOpenSignatureDialog(false)}
        onConfirm={handleSignatureComplete} // Only one action is passed here
      />
      <RemarkDialog
        open={openRemarkDialog}
        onClose={() => setOpenRemarkDialog(false)} // Close the RemarkDialog
        onConfirm={handleRemarkConfirm} // Handle the remark confirmation and proceed to E-Signature
      />

      <SelectUserDialog
        open={openuserDialog}
        onClose={handleuserCloseDialog}
        onConfirm={handleConfirmSelection}
      />
      {/* <ConditionalDialog
        open={dialogeffectiveOpen}
        onClose={handleDialogClose} // Handle dialog close
        onConfirm={handleDialogConfirm} // Handle dialog confirmation
        trainingStatus={trainingRequired} // Pass trainingRequired as trainingStatus
        documentId={id}
      /> */}
      <ToastContainer position="top-right" autoClose={3000} />
    </MDBox>
  );
};

export default DocumentView;
