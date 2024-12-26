import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useGetTemplateQuery } from "api/auth/texteditorApi";
import mammoth from "mammoth";

const PrintDocumentDialog = ({ open, onClose, id }) => {
  const [documentUrl, setDocumentUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data, error, isLoading: apiLoading } = useGetTemplateQuery(id);
  const [printSuccess, setPrintSuccess] = useState(null);
  const [customPrintWindow, setCustomPrintWindow] = useState(null);

  const updatePrintStatus = (status) => {
    console.log("Print Status:", status);
    // Update print status via API or any custom logic
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

  const handlePrint = async () => {
    let success = true;

    try {
      if (documentUrl && documentUrl.endsWith(".docx")) {
        const response = await fetch(documentUrl);
        const arrayBuffer = await response.arrayBuffer();

        mammoth.convertToHtml({ arrayBuffer })
          .then((result) => {
            const htmlContent = result.value;

            // Create a new window for custom print controls
            const newWindow = window.open("", "_blank", "width=800,height=600");
            setCustomPrintWindow(newWindow); // Store reference to the custom window

            // Add the document content to the new window
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
                    }
                  </style>
                </head>
                <body>
                  <div id="document-container">${htmlContent}</div>
                </body>
              </html>
            `);
            newWindow.document.close();

            // Trigger the print action directly
            if (newWindow) {
              newWindow.focus();
              newWindow.print(); // This will show the print dialog for the document
            }
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <MDBox sx={{ textAlign: "center" }}>
        <MDTypography variant="h4" fontWeight="medium" color="#344767" mt={1}>
          Print Document
        </MDTypography>
      </MDBox>

      <DialogContent>
        {isLoading || apiLoading ? (
          <MDTypography>Loading document...</MDTypography>
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

      <DialogActions>
        <MDButton onClick={onClose} color="error" sx={{ marginRight: "10px" }}>
          Close
        </MDButton>
        <MDButton
          variant="gradient"
          color="success"
          fullWidth
          disabled={isLoading || !documentUrl}
          onClick={handlePrint}
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
};

export default PrintDocumentDialog;
