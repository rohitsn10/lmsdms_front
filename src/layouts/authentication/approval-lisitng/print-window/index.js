import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useGetTemplateQuery } from "api/auth/texteditorApi";
import mammoth from "mammoth";

// AntiCopyPattern component to render a watermark pattern
const AntiCopyPattern = () => {
  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="antiCopyPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#0066CC" strokeWidth="1">
            <path d="M 10 0 L 20 10 L 10 20 L 0 10 Z" />
            <path d="M 5 0 L 15 10 L 5 20 L -5 10 Z" />
            <path d="M 15 0 L 25 10 L 15 20 L 5 10 Z" />
            <path d="M -5 0 L 5 10 L -5 20 L -15 10 Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#antiCopyPattern)" />
    </svg>
  );
};

// PrintDocumentDialog component to handle document printing
const PrintDocumentDialog = ({ open, onClose, id, noOfRequestByAdmin }) => {
  const [documentUrl, setDocumentUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data, error, isLoading: apiLoading } = useGetTemplateQuery(id);
  const [printSuccess, setPrintSuccess] = useState(null);
  const [customPrintWindow, setCustomPrintWindow] = useState(null);

  // Update print status (for tracking success or failure)
  const updatePrintStatus = (status) => {
    console.log("Print Status:-----", status);
  };

  useEffect(() => {
    if (open && !apiLoading) {
      setIsLoading(true);
      if (data) {
        setDocumentUrl(data?.template_url); // Assuming the response contains documentUrl
      }
      setIsLoading(false);
    }
  }, [open, apiLoading, data]);

  // Handle print operation
  const handlePrint = async () => {
    let success = true;

    try {
      if (documentUrl && documentUrl.endsWith(".docx")) {
        const response = await fetch(documentUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Convert DOCX to HTML using mammoth
        mammoth
          .convertToHtml({ arrayBuffer })
          .then((result) => {
            const htmlContent = result.value;

            // Create a new window for custom print controls
            const newWindow = window.open("", "_blank", "width=800,height=600");
            setCustomPrintWindow(newWindow); // Store reference to the custom window

            // Add the document content, watermark pattern, and styling to the new window
            newWindow.document.write(`
              <html>
                <head>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      padding: 20px;
                      margin: 0;
                      font-size: 12px;
                    }
                    #document-container {
                      width: 100%;
                      margin: 0 auto;
                      padding: 10px;
                      background-color: #fff;
                      border: 1px solid #ccc;
                      position: relative;
                    }
                    .watermark {
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      font-size: 3em;
                      color: rgba(0, 102, 204, 0.2); /* Light blue color with transparency */
                      z-index: 10;
                      pointer-events: none;
                      font-weight: bold;
                    }
                    .anti-copy-pattern {
                      position: absolute;
                      top: 0;
                      left: 0;
                      z-index: -1;
                      width: 100%;
                      height: 100%;
                    }
                  </style>
                </head>
                <body>
                  <div id="document-container">
                    <div class="watermark">Water Mark </div>
                    <div style="position: absolute; top: 0; left: 0; z-index: -1;">
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="antiCopyPattern" width="20" height="20" patternUnits="userSpaceOnUse">
        <g fill="none" stroke="#0066CC" strokeWidth="1">
          <path d="M 10 0 L 20 10 L 10 20 L 0 10 Z" />
          <path d="M 5 0 L 15 10 L 5 20 L -5 10 Z" />
          <path d="M 15 0 L 25 10 L 15 20 L 5 10 Z" />
          <path d="M -5 0 L 5 10 L -5 20 L -15 10 Z" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#antiCopyPattern)" />
  </svg>
</div>

                    ${htmlContent}
                  </div>
                </body>
              </html>
            `);

            newWindow.document.close();

            setTimeout(() => {
              if (newWindow) {
                newWindow.focus();
                newWindow.print();
              }
            }, 500); // Delay of 500ms to ensure content is fully loaded

            if (updatePrintStatus) {
              updatePrintStatus(true);
            }

            setPrintSuccess(true);
          })
          .catch((error) => {
            console.error("Error converting DOCX to HTML:", error);
            success = false;
          });
      } else {
        success = false;
      }
    } catch (error) {
      console.error("Error fetching the DOCX file:", error);
      success = false;
    }

    if (updatePrintStatus) {
      updatePrintStatus(success);
    }

    setPrintSuccess(success);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ borderRadius: 2, boxShadow: 3 }}
    >
      <MDBox sx={{ textAlign: "center", padding: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <MDTypography variant="h4" fontWeight="medium" color="#344767" mt={1}>
          Print Document
        </MDTypography>
      </MDBox>

      <DialogContent sx={{ padding: "20px", backgroundColor: "#fafafa" }}>
        {isLoading || apiLoading ? (
          <MDBox sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
            <CircularProgress />
          </MDBox>
        ) : error ? (
          <MDTypography color="error">Error fetching document: {error.message}</MDTypography>
        ) : (
          <div>
            {documentUrl ? (
              <MDTypography>Document is ready to print.</MDTypography>
            ) : (
              <MDTypography>No document found.</MDTypography>
            )}
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
        <MDButton
          onClick={onClose}
          color="error"
          sx={{ marginRight: "10px", textTransform: "capitalize" }}
        >
          Close
        </MDButton>
        <MDButton
          variant="gradient"
          color="success"
          fullWidth
          disabled={isLoading || !documentUrl}
          onClick={handlePrint}
          sx={{
            backgroundColor: "#4caf50",
            ":hover": {
              backgroundColor: "#388e3c",
            },
          }}
        >
          Print Document
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

PrintDocumentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired, // The document ID passed here
  noOfRequestByAdmin: PropTypes.number, // Add this to propTypes to validate
};

export default PrintDocumentDialog;
