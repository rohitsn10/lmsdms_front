import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useGetTemplateQuery } from "api/auth/texteditorApi";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

// PrintDocumentDialog component
const PrintDocumentDialog = ({ open, onClose, id, noOfRequestByAdmin, printNumber }) => {
  const [documentFile, setDocumentFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data, error, isLoading: apiLoading } = useGetTemplateQuery(id);
  const [printCount, setPrintCount] = useState(0);

  useEffect(() => {
    if (open && !apiLoading) {
      setIsLoading(true);
      if (data) {
        fetchDocument(data); // Fetch the file from API
      }
      setIsLoading(false);
    }
  }, [open, apiLoading, data]);

  // Fetch and store document file
  const fetchDocument = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      setDocumentFile(blob);
    } catch (err) {
      console.error("Error fetching document:", err);
    }
  };

  const handlePrint = async () => {
    if (!documentFile) return;
    if (printCount >= noOfRequestByAdmin) {
      alert("Print limit reached!");
      return;
    }
  
    const printId = printNumber[printCount]; // Get the corresponding print number
  
    const reader = new FileReader();
    reader.readAsArrayBuffer(documentFile);
    reader.onload = async (event) => {
      try {
        const content = event.target.result;
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip);
  
        // Replace placeholder in .docx file (Ensure your docx template has {number} placeholder)
        doc.render({ number: printId });
  
        // Generate modified docx file as Blob
        const updatedBlob = new Blob([doc.getZip().generate({ type: "blob" })], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
  
        // Convert Blob to URL for printing
        const fileURL = URL.createObjectURL(updatedBlob);
  
        // Open new window for printing
        const printWindow = window.open("", "_blank", "width=800,height=600");
  
        printWindow.document.write(`
          <html>
            <head>
              <style>
                @media print {
                  body::before {
                    content: "Print ID: ${printId}";
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    font-size: 14px;
                    color: red;
                  }
                }
              </style>
            </head>
            <body>
              <iframe src="${fileURL}" width="100%" height="100%"></iframe>
            </body>
          </html>
        `);
  
        printWindow.document.close();
  
        setTimeout(() => {
          printWindow.print();
        }, 1000);
  
        setPrintCount((prev) => prev + 1);
      } catch (err) {
        console.error("Error modifying document:", err);
      }
    };
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ borderRadius: 2, boxShadow: 3 }}>
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
          <MDTypography>
            {documentFile ? "Document is ready to print." : "No document found."}
          </MDTypography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
        <MDButton onClick={onClose} color="error" sx={{ marginRight: "10px", textTransform: "capitalize" }}>
          Close
        </MDButton>
        <MDButton
          variant="gradient"
          color="success"
          fullWidth
          disabled={isLoading || !documentFile}
          onClick={handlePrint}
          sx={{
            backgroundColor: "#4caf50",
            ":hover": { backgroundColor: "#388e3c" },
          }}
        >
          Print Document ({printCount}/{noOfRequestByAdmin})
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

PrintDocumentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  noOfRequestByAdmin: PropTypes.number.isRequired,
  printNumber: PropTypes.array.isRequired, // Changed to array for multiple prints
};

export default PrintDocumentDialog;