import React, { useState, useRef } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useRequestForgotPasswordOtpMutation, useVerifyForgotPasswordOtpMutation } from 'api/auth/forgotpassApi';

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // To control the flow between cards

  const inputRefs = useRef([]);

  const [requestForgotPasswordOtp] = useRequestForgotPasswordOtpMutation();
  const [verifyForgotPasswordOtp] = useVerifyForgotPasswordOtpMutation();

  // Step 1: Handle Email Submit to request OTP
  const handleEmailSubmit = async () => {
    try {
      const response = await requestForgotPasswordOtp(email).unwrap();
      if (response.status) {
        setMessage(response.message);
        setStep(2); // Move to OTP verification step
      }
    } catch (error) {
      setMessage(error.data?.message || "Error sending OTP");
    }
  };

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    if (value.match(/^[0-9]{0,1}$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) inputRefs.current[index + 1].focus();
      if (!value && index > 0) inputRefs.current[index - 1].focus();
    }
  };

  // Handle OTP paste for quick entry
  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("").slice(0, 6);
      setOtp(newOtp);
      newOtp.forEach((_, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = newOtp[index];
          if (index < newOtp.length - 1) inputRefs.current[index + 1].focus();
        }
      });
    }
  };

  // Step 2: Handle OTP Verification and move to password reset step
  const handleOtpSubmit = async () => {
    if (otp.join("").length === 6) {
      try {
        const response = await verifyForgotPasswordOtp({ email, otp: otp.join("") }).unwrap();
        if (response.status) {
          setMessage("OTP verified successfully. Please set your new password.");
          setStep(3); // Move to "Set New Password" card
        }
      } catch (error) {
        setMessage(error.data?.message || "Error verifying OTP");
      }
    } else {
      setMessage("Invalid OTP. Please enter a 6-digit OTP.");
    }
  };

  // Step 3: Final Password Reset Submission
  const handlePasswordResetSubmit = async () => {
    if (password && confirm_password && password === confirm_password) {
      try {
        const response = await verifyForgotPasswordOtp({
          email,
          otp: otp.join(""),
          password,
          confirm_password,
        }).unwrap();
        if (response.status) {
          setMessage("Password reset successfully.");
        }
      } catch (error) {
        setMessage(error.data?.message || "Error resetting password");
      }
    } else {
      setMessage("Passwords do not match. Please ensure both fields are filled.");
    }
  };

  return (
    <Card sx={{ width: 400, mx: "auto", mt: 20 }}>
      <MDBox
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="success"
        mx={2}
        mt={-3}
        py={2}
        mb={1}
        textAlign="center"
      >
        <MDTypography variant="h3" fontWeight="medium" color="#344767" mt={1}>
          {step === 1 ? "Forgot Password?" : step === 2 ? "Enter OTP" : "Set New Password"}
        </MDTypography>
        <MDTypography display="block" variant="button" color="#344767" my={1}>
          {step === 1
            ? "Enter your email below."
            : step === 2
            ? "Enter the 6-digit OTP sent to your email."
            : "Enter your new password."}
        </MDTypography>
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox component="form" role="form">
          {step === 1 && (
            <MDBox mb={4}>
              <MDInput
                type="email"
                label="Enter Your Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
          )}
          {step === 2 && (
            <MDBox mb={4} display="flex" justifyContent="space-between">
              {otp.map((digit, index) => (
                <MDInput
                  key={index}
                  type="text"
                  label=""
                  inputProps={{
                    maxLength: 1,
                    style: { width: "30px", height: "30px", textAlign: "center", marginRight: "8px" },
                    onPaste: handleOtpPaste,
                  }}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                />
              ))}
            </MDBox>
          )}
          {step === 3 && (
            <>
              <MDBox mb={4}>
                <MDInput
                  type="password"
                  label="New Password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </MDBox>
              <MDBox mb={4}>
                <MDInput
                  type="password"
                  label="Confirm Password"
                  fullWidth
                  value={confirm_password}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </MDBox>
            </>
          )}
          {message && (
            <MDTypography variant="body2" color="error" textAlign="center">
              {message}
            </MDTypography>
          )}
          <MDBox mt={6} mb={1}>
            {step === 1 && (
              <MDButton variant="gradient" color="submit" fullWidth onClick={handleEmailSubmit}>
                Send OTP
              </MDButton>
            )}
            {step === 2 && (
              <MDButton variant="gradient" color="submit" fullWidth onClick={handleOtpSubmit}>
                Verify OTP
              </MDButton>
            )}
            {step === 3 && (
              <MDButton variant="gradient" color="submit" fullWidth onClick={handlePasswordResetSubmit}>
                Reset Password
              </MDButton>
            )}
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default ResetPassword;
