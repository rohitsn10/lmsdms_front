// Import necessary components
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { toast } from "react-toastify";
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from "@mui/material";

// Import the mutation hook
import { usePrintDocumentMutation } from "api/auth/printApi";

// Example issue types (Replace with actual options)
const issueTypes = ["issue 1", "issue 2", "issue 3"];

function PrintDocument() {
  const [numberOfPrints, setNumberOfPrints] = useState(1);
  const [issueType, setIssueType] = useState("");
  const [reasonForPrint, setReasonForPrint] = useState("");
  const { id } = useParams(); // Fetch sop_document_id from URL
  const navigate = useNavigate();

  // Initialize the mutation hook
  const [printDocument, { isLoading, isSuccess, error }] = usePrintDocumentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await printDocument({
        sop_document_id: id,
        no_of_print: numberOfPrints,
        issue_type: issueType,
        reason_for_print: reasonForPrint,
      }).unwrap(); // Unwrap the promise to handle the result directly
      console.log("API Response:", response);
      if (response.status) {
        alert(response.message); // Show success message
        navigate("/document-listing"); // Navigate after success
      } else {
        alert("Failed to process print request.");
      }
    } catch (err) {
      console.error("Error while submitting print request:", err);
      alert("An error occurred. Please try again.");
    }
  };

  // Function to clear all input fields
  const handleClear = () => {
    setNumberOfPrints(1);
    setIssueType("");
    setReasonForPrint("");
  };

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 600, mx: "auto", mt: 10, mb: 10 }}>
        <MDBox
          borderRadius="lg"
          sx={{
            background: "linear-gradient(212deg, #d5b282, #f5e0c3)",
            borderRadius: "lg",
            mx: 2,
            mt: -3,
            p: 2,
            mb: 1,
            textAlign: "center",
          }}
        >
          <MDTypography variant="h3" fontWeight="medium" color="#344767" mt={1}>
            Print Document
          </MDTypography>
        </MDBox>
        <MDBox mt={2} mb={1} display="flex" justifyContent="flex-end">
          <MDButton
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClear}
            sx={{ marginRight: "20px" }}
          >
            Clear
          </MDButton>
        </MDBox>
        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            {/* Number of Prints */}
            <MDBox mb={3}>
              <MDInput
                type="number"
                label="Number of Prints"
                fullWidth
                value={numberOfPrints}
                onChange={(e) => setNumberOfPrints(e.target.value)}
                inputProps={{ min: 1 }}
              />
            </MDBox>

            {/* Issue Type */}
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-issue-type-label">Issue Type</InputLabel>
                <Select
                  labelId="select-issue-type-label"
                  id="select-issue-type"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  input={<OutlinedInput label="Issue Type" />}
                  sx={{
                    minWidth: 200,
                    height: "3rem",
                    ".MuiSelect-select": {
                      padding: "0.45rem",
                    },
                  }}
                >
                  {issueTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            {/* Reason for Print */}
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Reason for Print"
                fullWidth
                value={reasonForPrint}
                onChange={(e) => setReasonForPrint(e.target.value)}
                multiline
                rows={3}
              />
            </MDBox>

            {/* Submit Button */}
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default PrintDocument;
