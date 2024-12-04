// Login.js
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Switch from "@mui/material/Switch"; 
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
  Alert,
} from "@mui/material";
import { login, requestUserGroupList } from '../../../api/auth/auth';
import { useAuth } from "hooks/use-auth";

function Login() {
  const [userId, setUserId] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); 
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(""); 
  const navigate = useNavigate(); 
  const [firstName, setFirstName] = useState("");
  const {updateUser, updateRole} = useAuth()

  const handleLogin = async () => {
    if (!userId || !password) {
      setError("Both User ID and Password are required.");
      return;
    }
  
    try {
      const response = await login({ username: userId, password });
  
      console.log("---RESPONSE-DATA",response.data)

      if (response && response.data && response.data.message === "Login successfully") {
        const token = response.data.data?.token;
        const userFirstName = response.data.data?.first_name; // Extract first name
  
        // Ensure token and first name exist before proceeding
        if (token && userFirstName) {
          sessionStorage.setItem("token", token); // Store token
          setFirstName(userFirstName); // Store first name in state
          updateUser(response.data.data, token)
          await fetchRoles(token); // Fetch roles with the token
          setDialogOpen(true); // Open role selection dialog
          setError(""); // Clear error if login is successful
        } else {
          setError("Login successful, but missing required information.");
        }
      } else {
        setError("Incorrect User ID or Password.");
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Incorrect User ID or Password.");
      setDialogOpen(false);
    }
  };
  
  
  const fetchRoles = async (token) => {
    try {
        const response = await requestUserGroupList(token);
        console.log("User groups response:", response); 

        
        if (response && response.status === 200 && response.data) {
  
            if (response.data.data && Array.isArray(response.data.data)) {
                setRoles(response.data.data); 
            } else {
                console.error("Unexpected response structure:", response.data);
                setRoles([]);
                setError("No roles available or invalid response structure.");
            }
        } else {
            console.error("Server responded with an error:", response);
            setError("Unable to fetch user groups. Please check your connection or try again later.");
        }
    } catch (error) {
        console.error("Failed to fetch user groups:", error);
        setRoles([]);
        setError("Failed to fetch user groups. Please try again later.");
    }
};

  

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleOk = () => {
    updateRole(selectedRole)
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
            background: "linear-gradient(212deg, #d5b282, #f5e0c3)", 
            borderRadius: "lg",
            boxShadow: "#344767", 
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
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
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

            <MDBox display="flex" alignItems="center" mb={3}>
              <Switch checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
              <MDTypography variant="button" fontWeight="regular" ml={1}>
                Remember Me
              </MDTypography>
            </MDBox>

            <MDTypography
              variant="button"
              fontWeight="medium"
              textAlign="center"
              sx={{
                color: "#00008B", 
                cursor: "pointer", 
                "&:hover": {
                  textDecoration: "underline", 
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
                    backgroundColor: "#2F1B14", 
                    color: "#fff",
                  },
                }}
                fullWidth
                onClick={handleLogin} 
              >
                Login
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            width: "40vw", 
            height: "45vh", 
            borderRadius: "10px", 
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", 
            backgroundColor: "#fff", 
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center" }}>Select Role</DialogTitle>
        <DialogContent sx={{ padding: "16px 24px" }}>
          <Typography variant="body1" sx={{ marginBottom: "8px" }}>
            User Id: {userId}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "24px" }}>
            User Name: {firstName || "N/A"}
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
                height: "3rem", 
                ".MuiSelect-select": {
                  padding: "0.75rem", 
                },
                minWidth: "450px", 
                borderRadius: "10px", 
                backgroundColor: "#fff", 
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", 
              }}
            >
              {roles.length > 0 ? (
                roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name} 
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No roles available</MenuItem>
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleOk} color="primary"  disabled={!selectedRole}>
            OK
          </Button>
         
        </DialogActions>
      </Dialog>
    </BasicLayout>
  );
}

export default Login;
