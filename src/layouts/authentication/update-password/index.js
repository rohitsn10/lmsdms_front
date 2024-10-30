import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import ESignatureDialog from "layouts/authentication/ESignatureDialog";
import { useResetPasswordMutation } from "api/auth/userProfileApi"; 

function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("New Password and Confirm Password do not match!");
      return;
    }

    try {
      const response = await resetPassword({
        oldPassword,
        password: newPassword,
        confirmPassword,
      }).unwrap();

      if (response.status) {
        setOpenSignatureDialog(true);
      } else {
        setErrorMessage(response.message || "Password reset failed.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Password reset error:", error);
    }
  };

  const handleClear = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage("");
  };

  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false);
    navigate("/dashboard");
  };

  const toggleVisibility = (field) => {
    if (field === "old") setShowOldPassword((prev) => !prev);
    else if (field === "new") setShowNewPassword((prev) => !prev);
    else setShowConfirmPassword((prev) => !prev);
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
            Update Password
          </MDTypography>
        </MDBox>
        <MDBox mt={2} mb={1} display="flex" justifyContent="flex-end">
          <MDButton
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClear}
            sx={{ marginLeft: "10px", marginRight: "10px" }}
          >
            Clear
          </MDButton>
        </MDBox>

        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            {errorMessage && (
              <MDTypography color="error" align="center" mb={2}>
                {errorMessage}
              </MDTypography>
            )}
            <MDBox mb={3}>
              <MDInput
                type={showOldPassword ? "text" : "password"}
                label="Old Password"
                fullWidth
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => toggleVisibility("old")}>
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type={showNewPassword ? "text" : "password"}
                label="New Password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => toggleVisibility("new")}>
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => toggleVisibility("confirm")}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* E-Signature Dialog */}
      <ESignatureDialog open={openSignatureDialog} handleClose={handleCloseSignatureDialog} />
    </BasicLayout>
  );
}

export default UpdatePassword;
