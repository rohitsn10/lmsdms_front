import React, { useState, useRef } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useRequestForgotPasswordOtpMutation, useVerifyForgotPasswordOtpMutation } from 'api/auth/forgotpassApi';

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);

  const inputRefs = useRef([]);

  const [requestForgotPasswordOtp] = useRequestForgotPasswordOtpMutation();
  const [verifyForgotPasswordOtp] = useVerifyForgotPasswordOtpMutation();

  const handleOtpChange = (index, value) => {
    if (/^[0-9]$/.test(value)) {  // Accepts only a single digit
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Move focus to the next box if a digit is entered
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";  // Clear the current box
      setOtp(newOtp);

      if (index > 0) {
        inputRefs.current[index - 1].focus();  // Move to the previous box
      }
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").slice(0, 6);

    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);

      // Fill each input and move focus to the last input
      newOtp.forEach((digit, index) => {
        inputRefs.current[index].value = digit;
        if (index < 5) {
          inputRefs.current[index + 1].focus();
        }
      });
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
          {step === 1 ? "Forgot Password?" : "Enter OTP"}
        </MDTypography>
        <MDTypography display="block" variant="button" color="#344767" my={1}>
          {step === 1 ? "Enter your email below." : "Enter the 6-digit OTP sent to your email."}
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
                  inputProps={{
                    maxLength: 1,
                    style: { width: "30px", height: "30px", textAlign: "center", marginRight: "8px" },
                    onPaste: handleOtpPaste,
                    onKeyDown: (e) => handleKeyDown(index, e),
                  }}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                />
              ))}
            </MDBox>
          )}
          <MDBox mt={6} mb={1}>
            {step === 1 && (
              <MDButton variant="gradient" color="info" fullWidth onClick={() => setStep(2)}>
                Send OTP
              </MDButton>
            )}
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default ResetPassword;
