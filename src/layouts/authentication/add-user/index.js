// Import necessary components
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from "@mui/material";
import linearGradient from "assets/theme/functions/linearGradient";

const roles = ["Author", "Purchase", "Reviewer", "Approver", "Doc_Admin"];
const departments = ["HR", "Finance", "IT", "Sales"]; // Example department options

function AddUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [department, setDepartment] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [jobPosition, setJobPosition] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("User Details Submitted:", {
      firstName,
      lastName,
      employeeId,
      email,
      userRole,
      department,
      joiningDate,
      jobPosition,
    });
    navigate("/dashboard");
  };

  // Function to clear all input fields
  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setEmployeeId("");
    setEmail("");
    setUserRole("");
    setDepartment("");
    setJoiningDate("");
    setJobPosition("");
  };

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 600, mx: "auto",mt:10,mb:10}}>
        <MDBox
           borderRadius="lg"
           sx={{
            background: "linear-gradient(212deg, #d5b282, #f5e0c3)", // Custom color gradient
            borderRadius: "lg",
            boxShadow: "0 4px 20px 0 rgba(213, 178, 130, 0.5)", // Custom colored shadow
            mx: 2,
            mt: -3,
            p: 2,
            mb: 1,
            textAlign: "center",
          }}
        >
          <MDTypography variant="h3" fontWeight="medium" color="#344767" mt={1}
           >
            Add User
          </MDTypography>
        </MDBox>
        <MDBox mt={2} mb={1} display="flex" justifyContent="flex-end">
          <MDButton
            variant="outlined"
            color="error"
            size="small" // Set the button size to small
            onClick={handleClear}
            sx={{ marginRight: '20px' }}
          >
            Clear
          </MDButton>
        </MDBox>

        <MDBox  pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="First Name"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Last Name"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Employee ID"
                fullWidth
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-role-label">User Role</InputLabel>
                <Select
                  labelId="select-role-label"
                  id="select-role"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  input={<OutlinedInput label="User Role" />}
                  sx={{
                    minWidth: 200,
                    height: "3rem", // Adjust the height here
                    ".MuiSelect-select": {
                      padding: "0.45rem", // Adjust padding for the select input text
                    },
                  }} // Ensure dropdown has a minimum width
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-department-label">Department</InputLabel>
                <Select
                  labelId="select-department-label"
                  id="select-department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  input={<OutlinedInput label="Department" />}
                  sx={{
                    minWidth: 200,
                    height: "3rem", // Adjust the height here
                    ".MuiSelect-select": {
                      padding: "0.75rem", // Adjust padding for the select input text
                    },
                  }} // Ensure dropdown has a minimum width
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="date"
                // label="Joining Date"
                fullWidth
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Job Position"
                fullWidth
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
              />
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default AddUser;
