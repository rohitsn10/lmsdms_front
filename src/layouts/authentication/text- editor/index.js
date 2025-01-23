import React, { useEffect, useState, useRef, useContext } from "react";
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
import { Button, AppBar, Toolbar, Typography, CircularProgress } from "@mui/material";
// Import AuthContext
import { AuthContext } from "context/auth-context";
const DocumentView = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [Error1,setError] = useState(null);
  const [docEditorLoaded, setDocEditorLoaded] = useState(false);
  const [editorConfig, setEditorConfig] = useState(null);
  const { data: templateData, isError, error: apiError } = useGetTemplateQuery(id);
  const [docContent, setDocContent] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const quillRef = useRef(null);

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
// Accessing Context for UserData.
  const {user,setValue}=useContext(AuthContext)
  console.log("User Data",user)
  console.log("-+-+-+-+-+-+-+-+-+-+-++--++--+", docAdmin);
  // Extract userGroupIds directly from documentsData
  const userGroupIds = documentsData?.userGroupIds || [];
  console.log("Extracted User Group IDs:", userGroupIds);
  console.log(data)
  // setDocID(data?.id)
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
    if (isLoading) return;

    if (isError) {
      setError(apiError?.message || "Failed to fetch template data");
      setLoading(false);
      return;
    } 
    console.log("Template Data:", templateData);
    console.log("Template URL:", templateData?.template_url);

    if (templateData?.template_url) {
      const fetchEditorConfig = async () => {
        try {
          // const response = await fetch(`http://127.0.0.1:8000/dms_module/get_editor_config?template_id=${data?.select_template}`, {
            const response = await fetch(`http://43.204.122.158:8080/dms_module/get_editor_config?template_id=${data?.select_template}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: templateData.template_url,
              user_name: "John Doe",
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch editor configuration");
          }

          const config = await response.json();
          setEditorConfig(config);
          setDocEditorLoaded(true);
        } catch (fetchError) {
          setError("Failed to fetch ONLYOFFICE configuration");
          console.error(fetchError);
        } finally {
          setLoading(false);
        }
      };

      fetchEditorConfig();
    } else {
      setError("Template URL is missing in the API response");
      setLoading(false);
    }
  }, [isLoading, isError, templateData, apiError]);

  useEffect(() => {
    if (docEditorLoaded && editorConfig) {
      const script = document.createElement("script");
      script.src = "http://127.0.0.1/web-apps/apps/api/documents/api.js"; // ONLYOFFICE API script URL
      script.onload = () => {
        try {
          new window.DocsAPI.DocEditor("onlyoffice-editor-container", {
            width: "100%",
            height: "100%",
            type: "desktop",
            document: editorConfig.document,
            editorConfig: {
              mode: "edit", // Ensure the document is in edit mode
              callbackUrl: editorConfig.callbackUrl, // Save callback URL
              user: {
                id: "1",
                // name: "Rohit Sharma",
                name: `${user?.first_name}`,

              },
              watermark: {
                text: "Confidential", // The text of the watermark
                color: "rgba(192, 192, 192, 0.5)", // Semi-transparent light gray color
                fontSize: 50, // Size of the watermark text
                diagonal: true, // Place the watermark diagonally
                visibleForAllUsers: true, // Make the watermark visible for all users
              },
              customization: {
                autosave: true, // Enable autosave
                hideRightMenu: true, // Hide the right-side menu
                buttons: ["save"], // Restrict buttons to Save
              },
            },
            events: {
              onDocumentStateChange: (event) => {
                console.log("Document state changed:", event.data);
              },
            },
            token: editorConfig.token, // Pass the authentication token
          });
          console.log("ONLYOFFICE editor initialized with watermark");
        } catch (initError) {
          setError("Failed to initialize ONLYOFFICE editor");
          console.error(initError);
        }
      };
      script.onerror = () => {
        setError("Failed to load ONLYOFFICE script");
        console.error("Script load error");
      };
      document.body.appendChild(script);
    }
  }, [docEditorLoaded, editorConfig]);

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
          response = await documentApproveStatus({
            document_id: id,
            status: "3",
            remark,
            visible_to_users: reviewer,
            approver,
            doc_admin: docAdmin,
          }).unwrap();
          console.log("");
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
  if (loading || isLoading) {
    return (
      <Box padding={2} display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography sx={{ marginLeft: 2 }}>Loading editor...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding={2} display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">{`Error: ${error.message}`}</Typography>
      </Box>
    );
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
        display: "flex",
        flexDirection: "column",
        height: "190vh",
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Document Editor
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        id="onlyoffice-editor-container"
        sx={{
          flex: 1,
          backgroundColor: "#fff",
          boxShadow: 2,
          margin: "20px",
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: 2,
          backgroundColor: "#f4f4f4",
        }}
      >
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
          {(document_current_status === "3" || document_current_status === "2") &&
            isButtonVisible([3]) && (
              <>
                <MDButton
                  variant="gradient"
                  color="submit"
                  onClick={handleReview}
                  disabled={isLoading}
                >
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
          {(document_current_status === "4" || document_current_status === "2") &&
            isButtonVisible([4]) && (
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
      </Box>
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
