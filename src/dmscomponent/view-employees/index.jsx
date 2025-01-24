import { Card } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDInput from 'components/MDInput'
import MDTypography from 'components/MDTypography'
import React from 'react'

function ViewEmployeeStatus() {

    const columns = [
        { field: "empNo", headerName: "Emp. No.", width: 80 },
        { field: "name", headerName: "Name", width: 120 },
        { field: "empCreated", headerName: "Emp. Created", width: 100, type: "boolean" },
        { field: "deptAssign", headerName: "Dept. Assign", width: 100, type: "boolean" },
        { field: "inductionCompleted", headerName: "Induction Completed", width: 150, type: "boolean" },
        { field: "inductionCertificate", headerName: "Induction Certificate", width: 150, type: "boolean" },
        { field: "jrAssign", headerName: "JR Assign", width: 100, type: "boolean" },
        { field: "jrApproval", headerName: "JR Approval", width: 100, type: "boolean" },
        { field: "tniGeneration", headerName: "TNI Generation", width: 100, type: "boolean" },
        { field: "tniConsent", headerName: "TNI Consent", width: 100, type: "boolean" },
        { field: "qualification", headerName: "Qualification", width: 100, type: "boolean" },
        { field: "jrAreaTransfer", headerName: "JR/Area Transfer", width: 150, type: "boolean" },
      ];
      const rows = [
        { id: 1, empNo: "E001", name: "John Doe", empCreated: true, deptAssign: false, inductionCompleted: true, inductionCertificate: false, jrAssign: true, jrApproval: true, tniGeneration: true, tniConsent: false, qualification: true, jrAreaTransfer: false },
        { id: 2, empNo: "E002", name: "Jane Smith", empCreated: false, deptAssign: true, inductionCompleted: true, inductionCertificate: true, jrAssign: false, jrApproval: true, tniGeneration: false, tniConsent: true, qualification: false, jrAreaTransfer: true },
        { id: 3, empNo: "E003", name: "Alice Johnson", empCreated: true, deptAssign: true, inductionCompleted: false, inductionCertificate: true, jrAssign: true, jrApproval: false, tniGeneration: true, tniConsent: true, qualification: true, jrAreaTransfer: false },
        { id: 4, empNo: "E004", name: "John Doe", empCreated: true, deptAssign: false, inductionCompleted: true, inductionCertificate: false, jrAssign: true, jrApproval: true, tniGeneration: true, tniConsent: false, qualification: true, jrAreaTransfer: false },
        { id: 5, empNo: "E005", name: "Jane Smith", empCreated: false, deptAssign: true, inductionCompleted: true, inductionCertificate: true, jrAssign: false, jrApproval: true, tniGeneration: false, tniConsent: true, qualification: false, jrAreaTransfer: true },
        { id: 6, empNo: "E006", name: "Alice Johnson", empCreated: true, deptAssign: true, inductionCompleted: false, inductionCertificate: true, jrAssign: true, jrApproval: false, tniGeneration: true, tniConsent: true, qualification: true, jrAreaTransfer: false },
      ];

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center">
          <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center" }}>
            Employee workflow
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
            <DataGrid 
            rows={rows} 
            columns={columns} 
            pageSize={3} 
            rowsPerPageOptions={[1]} 
            sx={{
          "& .MuiDataGrid-columnHeaders": {
            whiteSpace: "normal",
            wordWrap: "normal",
            lineHeight: "1.2",
            fontSize:'12px'
          },    
        }}
             />

        </MDBox>
      </Card>
    </MDBox>
  )
}

export default ViewEmployeeStatus