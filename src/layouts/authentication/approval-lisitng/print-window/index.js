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
import { useGetTemplateQuery } from "api/auth/texteditorApi"; // Use this query instead of the mutation

const PrintDocumentDialog = ({ open, onClose, id }) => {
  const [documentUrl, setDocumentUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the document URL using the `id`
  const { data, error, isLoading: apiLoading } = useGetTemplateQuery(id); // Pass `id` to the query

  console.log("Id get in dialog : ==============",id);
  useEffect(() => {
    if (open && !apiLoading) {
      setIsLoading(true);
      if (data) {
        setDocumentUrl(data?.template_url); // Assuming the response contains documentUrl
      }
      setIsLoading(false);
    }
  }, [open, apiLoading, data]);

  const handlePrint = () => {
    // Create a temporary hidden iframe to load the document content and trigger print
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
            <iframe src="${documentUrl}" width="100%" height="100%"></iframe>
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
