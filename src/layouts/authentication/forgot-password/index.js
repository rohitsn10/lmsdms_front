// Import necessary components
import React, { useState, useRef } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // To control the flow between cards

  const inputRefs = useRef([]);

  const handleEmailSubmit = () => {
    // Here you would typically send the email to your backend to receive the OTP
    console.log("Email submitted:", email);
    setMessage("OTP has been sent to your email.");
    setStep(2); // Move to the OTP entry step
  };

  const handleOtpChange = (index, value) => {
    if (value.match(/^[0-9]{0,1}$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;

      setOtp(newOtp);

      // Move to the next input if the value is valid
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }

      // Move to the previous input if the value is empty
      if (!value && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").trim();

    // Check if the pasted data is exactly 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("").slice(0, 6);
      setOtp(newOtp);
      newOtp.forEach((_, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = newOtp[index]; // Set value for each input box
          if (index < newOtp.length - 1) {
            inputRefs.current[index + 1].focus(); // Move focus to the next input
          }
        }
      });
    }
  };

  const handleOtpSubmit = () => {
    // Here you would typically verify the OTP entered by the user
    if (otp.join("").length === 6) {
      console.log("OTP submitted:", otp.join(""));
      setMessage("OTP verified, please set your new password.");
      setStep(3); // Move to the password reset step
    } else {
      setMessage("Invalid OTP. Please enter a 6-digit OTP.");
    }
  };

  const handlePasswordSubmit = () => {
    if (newPassword === confirmPassword) {
      // Here you would typically send the new password to your backend API
      console.log("New password set:", newPassword);
      setMessage("Password reset successfully.");
    } else {
      setMessage("Passwords do not match.");
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
          {step === 1
            ? "Forgot Password?"
            : step === 2
            ? "Enter OTP"
            : "Set New Password"}
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
                    style: {
                      width: "30px", // Width of the input box
                      height: "30px", // Height to make it square
                      textAlign: "center",
                      marginRight: "8px", // Gap between the boxes
                    },
                    onPaste: handleOtpPaste, // Handle paste event
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
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </MDBox>
              <MDBox mb={4}>
                <MDInput
                  type="password"
                  label="Confirm Password"
                  fullWidth
                  value={confirmPassword}
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
              <MDButton variant="gradient" color="submit" fullWidth onClick={handlePasswordSubmit}>
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
