// Import necessary components
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon
import Switch from "@mui/material/Switch"; // Import Switch for Remember Me
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import bplogo from "assets/images/logo-removebg-preview.png";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Button,
  Box,
} from "@mui/material";
import { login } from '../../../api/auth/auth'; 



const roles = ["Author", "Reviewer", "Approver", "Admin", "Doc Admin"];

function Login() {
  const [userId, setUserId] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); 
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    try {
      const response = await login({ username: userId, password });
      if (response.data) {
        
        console.log("Login successful:", response.data);
        setDialogOpen(true); 
      }
    } catch (error) {
      console.error("Login failed:", error);
      
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleOk = () => {
    console.log("Selected Role:", selectedRole);
    setDialogOpen(false);
    navigate("/dashboard");
  };

  const handleForgotPassword = () => {
    navigate("/forgotpassword");
  };

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 400, mx: "auto" }}>
        <MDBox
          variant="gradient"
          borderRadius="lg"
          coloredShadow="#344767"
          sx={{
            background: "linear-gradient(212deg, #d5b282, #f5e0c3)", // Custom color gradient
            borderRadius: "lg",
            boxShadow: "#344767", // Custom colored shadow
            mx: 2,
            mt: -3,
            p: 2,
            mb: 1,
            textAlign: "center",
          }}
        >
          <MDTypography variant="h3" fontWeight="medium" mt={1}>
            <MDBox
              component="img"
              src={bplogo} 
              alt="Logo"
              sx={{ height: "28px", width: "250px", display: "block", margin: "0 auto" }} 
            />
          </MDTypography>
        </MDBox>
        <MDBox mt={1} display="flex" justifyContent="center" alignItems="center">
          <MDTypography variant="h3" fontWeight="medium" textAlign="center">
            Login
          </MDTypography>
        </MDBox>
        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="User ID"
                fullWidth
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type={showPassword ? "text" : "password"}
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>

            {/* Remember Me Switch */}
            <MDBox display="flex" alignItems="center" mb={3}>
              <Switch checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
              <MDTypography variant="button" fontWeight="regular" ml={1}>
                Remember Me
              </MDTypography>
            </MDBox>

            {/* Forgot Password Link */}
            <MDTypography
              variant="button"
              fontWeight="medium"
              textAlign="center"
              sx={{
                color: "#00008B", // Dark blue color
                cursor: "pointer", // Add pointer to indicate it's clickable
                "&:hover": {
                  textDecoration: "underline", // Optional: underline on hover
                },
              }}
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </MDTypography>

            <MDBox mt={4} mb={1} sx={{ backgroundColor: "#F5E0C3" }}>
              <MDButton
                variant="gradient"
                sx={{
                  backgroundColor: "#2F1B14",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#2F1B14", // Updated hover color
                    color: "#fff",
                  },
                }}
                fullWidth
                onClick={handleLogin} // Trigger the API call on button click
              >
                Login
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* Role Selection Popup */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md" // Match the width of the first dialog
        sx={{
          "& .MuiDialog-paper": {
            width: "40vw", // Match 30% viewport width
            height: "45vh", // Match 42% viewport height
            borderRadius: "10px", // Keep smooth rounded corners
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow for clean look
            backgroundColor: "#fff", // Light background
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center" }}>Select Role</DialogTitle> {/* Center the title */}
        <DialogContent sx={{ padding: "16px 24px" }}>
          <Typography variant="body1" sx={{ marginBottom: "8px" }}>
            User Id: {userId}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "24px" }}>
            User Name: Vasu Patel
          </Typography>

          <FormControl fullWidth margin="dense">
            <InputLabel id="select-role-label" sx={{ height: "2.5rem" }}>
              Select Role
            </InputLabel>
            <Select
              labelId="select-role-label"
              id="select-role"
              value={selectedRole}
              onChange={handleRoleChange}
              input={<OutlinedInput label="Select Role" />}
              sx={{
                height: "3rem", // Match height from the first dialog
                ".MuiSelect-select": {
                  padding: "0.75rem", // Adjust padding for a cleaner look
                },
                minWidth: "450px", // Match the width from the first dialog
                borderRadius: "10px", // Keep smooth corners
                backgroundColor: "#fff", // Clean white background
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Soft shadow
              }}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "16px 24px",
          }}
        >
          <Button
            onClick={handleCloseDialog} // Close the dialog when cancel is clicked
            variant="outlined"
            sx={{
              color: "primary.main",
              borderColor: "primary.main", // Match the color of the border
              "&:hover": { backgroundColor: "primary.dark", color: "#fff" }, // Add hover effect
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleOk} // Handle the role selection
            variant="contained"
            sx={{
              backgroundColor: "primary.main",
              "&:hover": { backgroundColor: "primary.dark" }, // Add hover effect
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </BasicLayout>
  );
}

export default Login;
