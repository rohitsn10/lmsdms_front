import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { usePrintConvertPdfMutation } from "api/auth/printApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PrintDocumentDialog = ({
  open,
  onClose,
  id,
  noOfRequestByAdmin,
  printNumber,
  document_status,
  print_count,
  issue_type,
}) => {
  const [pdfLink, setPdfLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [printCount, setPrintCount] = useState(print_count);
  const [printConvertPdf] = usePrintConvertPdfMutation();
  console.log("+++++++++++++++++++++++++++++++++++++++++++++",issue_type)
  useEffect(() => {
    if (open) {
      fetchPdf();
    }
  }, [open]);
  const mapDocumentStatus = (status) => {
    switch (status) {
      case "Created":
      case "Send Back":
        return "DRAFT";
      case "Under Reviewer":
        return "UNDER REVIEW";
      case "Under Approver":
        return "UNDER APPROVER";
      case "Effective":
      case "Revise":
        return "EFFECTIVE";
      case "Supersede":
        return "SUPERSEDED";
      case "Obsolete":
        return "OBSOLETED";
      default:
        return status; // Keep the original if not matched
    }
  };
  const fetchPdf = async () => {
    setIsLoading(true);
    try {
      const response = await printConvertPdf({
        sop_document_id: id,
        approval_numbers: printNumber,
        document_status: mapDocumentStatus(document_status), // Apply mapping function here
        issue_type: issue_type,
      }).unwrap();

      if (response && response.pdf_link) {
        setPdfLink(response.pdf_link);
      } else {
        console.error("Error fetching PDF: No file link received");
        toast.error("Failed to retrieve PDF link");
      }
    } catch (err) {
      console.error("Error fetching PDF:", err);
      toast.error("Error fetching PDF document");
    }
    setIsLoading(false);
  };
  const handlePrint = () => {
    if (!pdfLink || printCount >= noOfRequestByAdmin) {
      toast.warning("Print limit reached or PDF not available!");
      return;
    }
    try {
      const printWindow = window.open(pdfLink, "_blank");

      if (printWindow) {
        printWindow.addEventListener("load", () => {
          try {
            printWindow.print();
            setPrintCount((prev) => prev + 1);
            toast.success("Print successful");
          } catch (printError) {
            console.error("Print error in window:", printError);
            fallbackPrintMethod();
          }
        });
      } else {
        toast.warning("Popup blocked! Please allow popups to print the document.");
        fallbackPrintMethod();
      }
    } catch (error) {
      console.error("Print attempt failed:", error);
      fallbackPrintMethod();
    }
  };

  const fallbackPrintMethod = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.top = "-9999px";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.src = pdfLink;
    iframe.onload = () => {
      try {
        iframe.contentWindow.print();
        setPrintCount((prev) => prev + 1);
        toast.success("Print successful");
      } catch (error) {
        console.error("Fallback print method error:", error);
        toast.error("Unable to print document. Please check browser settings.");
      }
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
    document.body.appendChild(iframe);
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
        ) : printCount >= noOfRequestByAdmin ? (
          <MDTypography color="error">
            You reached the max limit which Doc Admin allows. For more prints, request again.
          </MDTypography>
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
  document_status: PropTypes.string.isRequired,
  print_count: PropTypes.number.isRequired,
  issue_type: PropTypes.string.isRequired,
};

export default PrintDocumentDialog;
