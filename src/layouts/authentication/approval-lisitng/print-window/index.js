import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { usePrintConvertPdfMutation } from "api/auth/printApi";

const PrintDocumentDialog = ({ open, onClose, id, noOfRequestByAdmin, printNumber }) => {
  const [pdfLink, setPdfLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [printCount, setPrintCount] = useState(0);
  const [printConvertPdf] = usePrintConvertPdfMutation();

  useEffect(() => {
    if (open) {
      fetchPdf();
    }
  }, [open]);

  const fetchPdf = async () => {
    setIsLoading(true);
    try {
      const response = await printConvertPdf(id).unwrap();
      if (response.status) {
        setPdfLink(response.pdf_link);
      } else {
        console.error("Error fetching PDF:", response.message);
      }
    } catch (err) {
      console.error("Error fetching PDF:", err);
    }
    setIsLoading(false);
  };

  const handlePrint = () => {
    if (!pdfLink || printCount >= noOfRequestByAdmin) {
      alert("Print limit reached or PDF not available!");
      return;
    }

    const printId = printNumber[printCount]; // Get unique print number
    const printWindow = window.open(pdfLink, "_blank", "width=800,height=600");

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
          <iframe src="${pdfLink}" width="100%" height="100%"></iframe>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => printWindow.print(), 1000);
    setPrintCount((prev) => prev + 1);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <MDBox sx={{ textAlign: "center", padding: 2, backgroundColor: "#f5f5f5" }}>
        <MDTypography variant="h4" fontWeight="medium" color="#344767">
          Print Document
        </MDTypography>
      </MDBox>

      <DialogContent sx={{ padding: "20px", backgroundColor: "#fafafa" }}>
        {isLoading ? (
          <MDBox sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
            <CircularProgress />
          </MDBox>
        ) : pdfLink ? (
          <MDTypography>Document is ready to print.</MDTypography>
        ) : (
          <MDTypography color="error">Failed to load document.</MDTypography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
        <MDButton onClick={onClose} color="error" sx={{ textTransform: "capitalize" }}>
          Close
        </MDButton>
        <MDButton
          variant="gradient"
          color="success"
          disabled={isLoading || !pdfLink || printCount >= noOfRequestByAdmin}
          onClick={handlePrint}
          sx={{ backgroundColor: "#4caf50", ":hover": { backgroundColor: "#388e3c" } }}
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
  id: PropTypes.number.isRequired,
  noOfRequestByAdmin: PropTypes.number.isRequired,
  printNumber: PropTypes.array.isRequired,
};

export default PrintDocumentDialog;