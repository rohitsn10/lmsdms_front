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
import ESignatureDialog from "layouts/authentication/ESignatureDialog"; // Ensure correct import


const sentBackRoles = ["Author", "Reviewer"];

function AddApproval() {
  const [approver, setApprover] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [sentBackTo, setSentBackTo] = useState("");
  const [approvedAt, setApprovedAt] = useState("");
  const [esignatureDialogOpen, setEsignatureDialogOpen] = useState(false); // State for E-Signature dialog

  const navigate = useNavigate();

  useEffect(() => {
    const currentUserRole = "Approver"; // Replace with dynamic role fetching logic
    const currentDate = new Date().toISOString().split("T")[0];
    setApprover(currentUserRole);
    setApprovedAt(currentDate);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEsignatureDialogOpen(true); // Open the E-Signature dialog on submit
  };

  const handleClear = () => {
    setApprovalStatus("");
    setSentBackTo("");
  };

  const handleCloseEsignatureDialog = () => {
    setEsignatureDialogOpen(false);
    navigate("/dashboard"); // Navigate after closing the dialog
  };

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 600, mx: "auto" }}>
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
            Add Approval
          </MDTypography>
        </MDBox>
        <MDBox mt={2} mb={1} display="flex" justifyContent="flex-end">
          <MDButton
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClear}
            sx={{ marginRight: '20px' }}
          >
            Clear
          </MDButton>
        </MDBox>
        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
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
                  sx={{ minWidth: 200, height: "3rem", ".MuiSelect-select": { padding: "0.45rem" }}}
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
                    sx={{ minWidth: 200, height: "3rem", ".MuiSelect-select": { padding: "0.45rem" }}}
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
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit">
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* E-Signature Dialog */}
      <ESignatureDialog
        open={esignatureDialogOpen}
        handleClose={handleCloseEsignatureDialog}
      />
    </BasicLayout>
  );
}

export default AddApproval;
