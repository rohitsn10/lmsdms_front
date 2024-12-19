import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import React, { useState, useEffect } from "react";
import MDTypography from "components/MDTypography";
import { useGetTemplateQuery } from "api/auth/texteditorApi"; 
import mammoth from "mammoth"; 

const PrintDocumentDialog = ({ open, onClose, id }) => {
  const [documentUrl, setDocumentUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data, error, isLoading: apiLoading } = useGetTemplateQuery(id); 

  console.log("Id get in dialog : ==============", id);

  useEffect(() => {
    if (open && !apiLoading) {
      setIsLoading(true);
      if (data) {
        console.log("Fetched data:", data); // Debugging line to inspect data
        setDocumentUrl(data?.template_url); // Assuming the response contains documentUrl
      }
      setIsLoading(false);
    }
  }, [open, apiLoading, data]);

  // Print handler
  const handlePrint = async () => {
    try {
      // Create a temporary hidden iframe to load the document content and trigger print
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";
      document.body.appendChild(iframe);

      const iframeDocument = iframe.contentWindow.document;
      iframeDocument.open();

      // Check if the document is a .docx file (we already know the URL points to a .docx file)
      if (documentUrl && documentUrl.endsWith(".docx")) {
        // Fetch the .docx file
        const response = await fetch(documentUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Convert the .docx file to HTML using Mammoth
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
          .then((result) => {
            const htmlContent = result.value; // HTML content of the .docx file

            // Inject the HTML content into the iframe
            iframeDocument.write(`
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
                  <div id="document-container">
                    ${htmlContent} <!-- Injected HTML content -->
                  </div>
                </body>
              </html>
            `);
            iframeDocument.close();

            iframe.onload = () => {
              iframe.contentWindow.focus();
              iframe.contentWindow.print();
              document.body.removeChild(iframe);
            };
          })
          .catch((error) => {
            console.error("Error converting DOCX to HTML:", error);
          });
      }
    } catch (error) {
      console.error("Error fetching the DOCX file:", error);
    }
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
  requestId: PropTypes.number.isRequired,
};

export default PrintDocumentDialog;
