import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from "@mui/material";
import ESignatureDialog from "layouts/authentication/ESignatureDialog/index.js";
import { useCreateUserMutation } from "api/auth/userApi";
import { useFetchDepartmentsQuery } from "api/auth/departmentApi";
import { getUserGroups } from "api/auth/auth";

function AddUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState([]);
  const [department, setDepartment] = useState("");
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRoles, setUserRoles] = useState([]);

  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const { data: departmentsData, isLoading: isDepartmentsLoading } = useFetchDepartmentsQuery();

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const response = await getUserGroups();
        console.log("User Groups API Response:", response);
        setUserRoles(response?.data?.data || []); // Ensure proper parsing of API response
      } catch (error) {
        console.error("Failed to fetch user roles:", error);
      }
    };

    fetchUserRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const userData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      username,
      user_role: userRole, // Send IDs of the selected roles
      department_id: department,
    };
  
    try {
      const response = await createUser(userData).unwrap();
      console.log("Response (JSON):", response); // Log the JSON response
      setOpenSignatureDialog(true);
    } catch (error) {
      console.error("Failed to create user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setUsername("");
    setUserRole("");
    setDepartment("");
  };

  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false);
    navigate("/dashboard");
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
            Add User
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
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Phone"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
  <FormControl fullWidth margin="dense">
    <InputLabel id="select-role-label">User Role</InputLabel>
    <Select
      labelId="select-role-label"
      id="select-role"
      multiple // Enable multiple selection
      value={userRole} // Ensure this is an array
      onChange={(e) => setUserRole(e.target.value)} // Update the state with the selected array
      input={<OutlinedInput label="User Role" />}
      renderValue={(selected) =>
        selected.map((roleId) => {
          const role = userRoles.find((r) => r.id === roleId);
          return role?.name || roleId;
        }).join(', ')
      } // Display selected roles as comma-separated names
      sx={{
        minWidth: 200,
        height: "3rem",
        ".MuiSelect-select": {
          padding: "0.45rem",
        },
      }}
    >
      {userRoles.length > 0 ? (
        userRoles.map((role) => (
          <MenuItem key={role.id} value={role.id}>
            {role.name}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No roles available</MenuItem>
      )}
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
                    height: "3rem",
                    ".MuiSelect-select": {
                      padding: "0.75rem",
                    },
                  }}
                  disabled={isDepartmentsLoading}
                >
                  {isDepartmentsLoading ? (
                    <MenuItem disabled>Loading departments...</MenuItem>
                  ) : (
                    departmentsData?.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.department_name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </MDBox>

            <MDBox mt={2} mb={1}>
              <MDButton
                variant="gradient"
                color="submit"
                fullWidth
                type="submit"
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? "Submitting..." : "Submit"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      <ESignatureDialog open={openSignatureDialog} handleClose={handleCloseSignatureDialog} />
    </BasicLayout>
  );
}

export default AddUser;
