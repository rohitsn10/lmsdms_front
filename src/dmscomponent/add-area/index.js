import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import ESignatureDialog from "layouts/authentication/ESignatureDialog";
import { FormControl, InputLabel, Select, OutlinedInput } from "@mui/material";
import { useCreateGetAreaMutation } from "apilms/AreaApi";
import { useFetchDepartmentsQuery } from "api/auth/departmentApi";

function AddArea() {
  const [areaName, setAreaName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { data: departments, isLoading, isError } = useFetchDepartmentsQuery();
  const [createArea, { isLoading: isCreating }] = useCreateGetAreaMutation();

  console.log("+---------------------+-+-+-+--+-+-+-+-+",departments);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createArea({
        area_name: areaName,
        department_id: departmentName,
        area_description: description,
      }).unwrap();

      setOpenSignatureDialog(true);
      console.log("Area Details Submitted:", { areaName, departmentName, description });
    } catch (error) {
      console.error("Error submitting area:", error);
    }
  };

  const handleClear = () => {
    setAreaName("");
    setDepartmentName("");
    setDescription("");
  };

  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false);
    navigate("/area-listing");
  };

  const handleDepartmentChange = (event) => {
    setDepartmentName(event.target.value);
  };

  if (isLoading) return <div>Loading departments...</div>;
  if (isError) return <div>Error fetching departments</div>;

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
            Add Area
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
                label="Area Name"
                fullWidth
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
              />
            </MDBox>
            <FormControl fullWidth margin="dense">
              <InputLabel id="select-department-label">Department Name</InputLabel>
              <Select
                labelId="select-department-label"
                id="select-department"
                value={departmentName}
                onChange={handleDepartmentChange}
                input={<OutlinedInput label="Department Name" />}
                sx={{
                  minWidth: 200,
                  height: "3rem",
                  ".MuiSelect-select": { padding: "0.45rem" },
                }}
              >
                {isLoading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : isError ? (
                  <MenuItem disabled>Error loading departments</MenuItem>
                ) : (
                  departments?.data?.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.department_name || "No name available"}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors?.department && (
                <p style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
                  {errors.department}
                </p>
              )}
            </FormControl>

            <MDBox mb={3}>
              <MDInput
                label="Description"
                multiline
                rows={4}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton
                variant="gradient"
                color="submit"
                fullWidth
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? "Submitting..." : "Submit"}
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

export default AddArea;
