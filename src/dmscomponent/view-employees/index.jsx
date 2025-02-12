import React from "react";
import { Card } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useUserListQuery } from "api/auth/userApi";

function ViewEmployeeStatus() {
  const { data, error, isLoading } = useUserListQuery();

  // Function to render tick (green) and cross (red) icons
  const renderStatusIcon = (params) => (
    <div style={{ display: "flex", justifyContent: "center", alignItems:'center' ,width: "100%",marginTop:'14px' }}>
      {params.value ? 
        <CheckCircleIcon style={{ color: "green",width:'22px',height:'22px' }} /> : 
        <CancelIcon style={{ color: "red",width:'22px',height:'22px' }} />
      }
    </div>
  );
  

  // Define the columns
  const columns = [
    { field: "empNo", headerName: "Emp. No.", width: 80 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "is_user_created", headerName: "Emp. Created", width: 120, renderCell: renderStatusIcon },
    { field: "is_department_assigned", headerName: "Dept. Assign", width: 130, renderCell: renderStatusIcon },
    { field: "is_induction_complete", headerName: "Induction Completed", width: 160, renderCell: renderStatusIcon },
    { field: "is_induction_certificate", headerName: "Induction Certificate", width: 160, renderCell: renderStatusIcon },
    { field: "is_jr_assign", headerName: "JR Assign", width: 100, renderCell: renderStatusIcon },
    { field: "is_jr_approve", headerName: "JR Approval", width: 120, renderCell: renderStatusIcon },
    { field: "is_tni_generate", headerName: "TNI Generation", width: 140, renderCell: renderStatusIcon },
    { field: "is_tni_consent", headerName: "TNI Consent", width: 120, renderCell: renderStatusIcon },
    { field: "is_qualification", headerName: "Qualification", width: 120, renderCell: renderStatusIcon },
  ];

  // Convert API data to rows
  const rows = data
    ? data?.data?.map((user, index) => ({
        id: user.id,
        empNo: `E00${index + 1}`,
        name: user.full_name,
        is_user_created: user.is_user_created,
        is_department_assigned: user.is_department_assigned,
        is_induction_complete: user.is_induction_complete,
        is_induction_certificate: user.is_induction_certificate,
        is_jr_assign: user.is_jr_assign,
        is_jr_approve: user.is_jr_approve,
        is_tni_generate: user.is_tni_generate,
        is_tni_consent: user.is_tni_consent,
        is_qualification: user.is_qualification,
      }))
    : [];

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center">
          <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center" }}>
            Employee Workflow
          </MDTypography>
        </MDBox>

        {/* Loading and Error Handling */}
        {isLoading ? (
          <MDTypography textAlign="center">Loading...</MDTypography>
        ) : error ? (
          <MDTypography color="error" textAlign="center">Error fetching data!</MDTypography>
        ) : (
          <MDBox display="flex" justifyContent="center" p={2}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  whiteSpace: "normal",
                  wordWrap: "normal",
                  lineHeight: "1.2",
                  fontSize: "12px",
                },
              }}
            />
          </MDBox>
        )}
      </Card>
    </MDBox>
  );
}

export default ViewEmployeeStatus;
