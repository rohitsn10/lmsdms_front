import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";

// Example roles for Sent Back To dropdown
const sentBackRoles = ["Author", "Reviewer"];

function AddApproval() {
  const [approver, setApprover] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [sentBackTo, setSentBackTo] = useState("");
  const [approvedAt, setApprovedAt] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Auto-fill approver and approvedAt based on user role and current date
    const currentUserRole = "Approver"; // Replace with dynamic role fetching logic
    const currentDate = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    setApprover(currentUserRole);
    setApprovedAt(currentDate);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Approval Details Submitted:", {
      approver,
      approvalStatus,
      sentBackTo,
      approvedAt,
    });
    // Navigate or perform any action post submission
    navigate("/dashboard");
  };

  // Function to clear input fields
  const handleClear = () => {
    setApprovalStatus("");
    setSentBackTo("");
  };

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 600, mx: "auto" }}>
        <MDBox
          borderRadius="lg"
          sx={{
            background: "linear-gradient(212deg, #d5b282, #f5e0c3)", // Custom color gradient
            borderRadius: "lg",
            // boxShadow: "0 4px 20px 0 rgba(213, 178, 130, 0.5)", // Custom colored shadow
            mx: 2,
            mt: -3,
            p: 2,
            mb: 1,
            textAlign: "center",
          }}
        >
          <MDTypography variant="h3" fontWeight="medium" color="#344767" mt={1}>
            Add Approval
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            {/* Approver (Auto-filled) */}
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Approver"
                fullWidth
                value={approver}
                disabled
              />
            </MDBox>

            {/* Approval Status */}
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="approval-status-label">Approval Status</InputLabel>
                <Select
                  labelId="approval-status-label"
                  id="approval-status"
                  value={approvalStatus}
                  onChange={(e) => setApprovalStatus(e.target.value)}
                  input={<OutlinedInput label="Approval Status" />}
                  sx={{ minWidth: 200 ,
                    height: "3rem", // Adjust the height here
                    ".MuiSelect-select": {
                      padding: "0.45rem", // Adjust padding for the select input text
                    },
                  }}
                >
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Sent Back">Sent Back</MenuItem>
                </Select>
              </FormControl>
            </MDBox>

            {/* Sent Back To */}
            {approvalStatus === "Sent Back" && (
              <MDBox mb={3}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="sent-back-to-label">Sent Back To</InputLabel>
                  <Select
                    labelId="sent-back-to-label"
                    id="sent-back-to"
                    value={sentBackTo}
                    onChange={(e) => setSentBackTo(e.target.value)}
                    input={<OutlinedInput label="Sent Back To" />}
                    sx={{ minWidth: 200 ,
                      height: "3rem", // Adjust the height here
                      ".MuiSelect-select": {
                        padding: "0.45rem", // Adjust padding for the select input text
                      },
                    }}
                  >
                    {sentBackRoles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </MDBox>
            )}

            {/* Approved At (Auto-filled) */}
            <MDBox mb={3}>
              <MDInput
                type="date"
                label="Approved At"
                fullWidth
                value={approvedAt}
                disabled
              />
            </MDBox>

            {/* Clear and Submit buttons */}
            <MDBox mt={2} mb={1} display="flex" justifyContent="space-between">
              <MDButton
                variant="outlined"
                color="error"
                size="small"
                onClick={handleClear}
                sx={{ alignSelf: 'flex-end' }}
              >
                Clear
              </MDButton>
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit">
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default AddApproval;
