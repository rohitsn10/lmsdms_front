import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { useUpdateDeleteDepartmentMutation } from "api/auth/departmentApi";  

const UpdateDepartment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [departmentName, setDepartmentName] = useState(state?.department.department_name || "");
    const [departmentDescription, setDepartmentDescription] = useState(state?.department.department_description || "");
    const [updateDeleteDepartment, { isLoading }] = useUpdateDeleteDepartmentMutation(); // Updated hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateDeleteDepartment({
                department_id: state.department.id,   // Pass the dynamic department_id
                department_name: departmentName,
                department_description: departmentDescription,
            }).unwrap();

            console.log("API Response:", response);

            if (response.status) {
                navigate("/department-listing");
            } else {
                console.error("Department update failed:", response.message);
            }
        } catch (error) {
            console.error("Error updating department:", error.message || error);
        }
    };

    const handleClear = () => {
        setDepartmentName("");
        setDepartmentDescription("");
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
                        Update Department
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
                        <MDBox mb={3}>
                            <MDInput
                                type="text"
                                label="Department Name"
                                fullWidth
                                value={departmentName}
                                onChange={(e) => setDepartmentName(e.target.value)}
                            />
                        </MDBox>
                        <MDBox mb={3}>
                            <MDInput
                                label="Department Description"
                                multiline
                                rows={4}
                                fullWidth
                                value={departmentDescription}
                                onChange={(e) => setDepartmentDescription(e.target.value)}
                            />
                        </MDBox>
                        <MDBox mt={2} mb={1}>
                            <MDButton variant="gradient" color="submit" fullWidth type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update"}
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </BasicLayout>
    );
};

export default UpdateDepartment;
