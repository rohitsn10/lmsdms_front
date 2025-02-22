import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useUserListQuery } from "api/auth/userApi"; // Fetch user data from userApi
import { useAuth } from "hooks/use-auth";
import { toast } from "react-toastify";
import DownloadIcon from "@mui/icons-material/Download";

// Import the hooks from your `lmsReportsAPI`
import {
  useGetEmployeeListQuery,
  useCreateInductionCertificateMutation,
  useGetEmployeeTrainingNeedIdentificationQuery,
} from "apilms/reportsApi";

const UserReports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clickedDownload, setClickedDownload] = useState(false); // Track button click state
  const [selectedUserId, setSelectedUserId] = useState(null); // Store the selected user ID for report

  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, error, isLoading } = useUserListQuery();
  const [filteredData, setFilteredData] = useState([]);

  // Conditional hook usage
  const { data: employeeData, isLoading: employeeLoading } = useGetEmployeeListQuery(
    selectedUserId, { skip: !clickedDownload }
  );

  const { data: trainingNeedData, isLoading: trainingNeedLoading } = useGetEmployeeTrainingNeedIdentificationQuery(
    selectedUserId, { skip: !clickedDownload }
  );

  useEffect(() => {
    if (data?.data) {
      const formattedData = data.data.map((item, index) => ({
        id: item.id,
        serial_number: index + 1,
        full_name: item.first_name
          ? `${item.first_name} ${item.last_name || ""}`.trim()
          : "N/A",
      }));
      setFilteredData(formattedData);
    }
  }, [data]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDownloadReport = (reportType, id) => {
    // Set clickedDownload to true, which will trigger the hooks
    setClickedDownload(true);
    setSelectedUserId(id); // Store the selected user ID for the report

    // Set a timeout to handle the data after the hooks have been called
    setTimeout(() => {
      try {
        let fileUrl = "";
        console.log(`Starting download for reportType: ${reportType}, userId: ${id}`);

        switch (reportType) {
          case "EmployeeTrainingNeed":
            if (trainingNeedData) {
              const trainingData = trainingNeedData.find(item => item.id === id);
              console.log("Fetched training data:", trainingData);
              fileUrl = trainingData?.data; // assuming 'data' holds the report URL
            }
            break;

          case "EmployeeJobRole":
            if (employeeData) {
              const jobRoleData = employeeData.find(item => item.id === id);
              console.log("Fetched job role data:", jobRoleData);
              fileUrl = jobRoleData?.data;
            }
            break;

          case "TrainingAttendance":
            if (employeeData) {
              const attendanceData = employeeData.find(item => item.id === id);
              console.log("Fetched attendance data:", attendanceData);
              fileUrl = attendanceData?.data;
            }
            break;

          default:
            throw new Error("Invalid report type");
        }

        if (fileUrl) {
          console.log(`Downloading file from URL: ${fileUrl}`);
          const link = document.createElement("a");
          link.href = fileUrl;
          link.download = `${reportType}_Report.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success(`${reportType} downloaded successfully!`);
        } else {
          console.log("No file URL returned, cannot download report.");
          toast.error(`No file available for ${reportType}.`);
        }
      } catch (error) {
        console.error("Error in handleDownloadReport:", error);
        toast.error(`Failed to download ${reportType}. Please try again. Error: ${error.message}`);
      } finally {
        // Reset the button click state to false
        setClickedDownload(false);
      }
    }, 1000); // Add a small delay to ensure the hooks are triggered and data is available
  };

  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "full_name", headerName: "Full Name", flex: 1, headerAlign: "center" },
    {
      field: "training_need",
      headerName: "Employee Training Need",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <MDButton
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => handleDownloadReport("EmployeeTrainingNeed", params.row.id)} // Pass the row ID
          startIcon={<DownloadIcon />}
        >
          Employee Training
        </MDButton>
      ),
    },
    {
      field: "job_role_report",
      headerName: "Employee Job Role Report",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <MDButton
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => handleDownloadReport("EmployeeJobRole", params.row.id)} // Pass the row ID
          startIcon={<DownloadIcon />}
        >
          Job Role
        </MDButton>
      ),
    },
    {
      field: "attendance_sheet",
      headerName: "Training Attendance Sheet",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <MDButton
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => handleDownloadReport("TrainingAttendance", params.row.id)} // Pass the row ID
          startIcon={<DownloadIcon />}
        >
          Attendance Sheet
        </MDButton>
      ),
    },
  ];

  const filteredDataList = filteredData.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center">
          <MDInput
            label="Search"
            variant="outlined"
            size="small"
            sx={{ width: "250px", mr: 2 }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center" }}>
            LMS User Reports
          </MDTypography>
        </MDBox>

        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={filteredDataList}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              sx={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                "& .MuiDataGrid-columnHeaders": {
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-cell": {
                  textAlign: "center",
                },
              }}
            />
          </div>
        </MDBox>
      </Card>
    </MDBox>
  );
};

export default UserReports;
