import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useUserListQuery } from "api/auth/userApi"; // Hook for fetching user data
import { useGetEmployeeTrainingNeedIdentificationQuery } from "apilms/reportsApi"; // Hook for fetching training need report
import { useGetEmployeeJobRoleReportQuery } from "apilms/reportsApi"; // Hook for fetching job role report (added this hook)
import { toast } from "react-toastify";
import DownloadIcon from "@mui/icons-material/Download";

const UserReports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null); // State to store selected user ID
  const { data, error, isLoading } = useUserListQuery(); // Fetch user data
  const [filteredData, setFilteredData] = useState([]);

  // Use the hook at the top level of the component
  const { data: trainingNeedData, isLoading: trainingNeedLoading } = useGetEmployeeTrainingNeedIdentificationQuery(selectedUserId, {
    skip: !selectedUserId, // Only call the hook when a user ID is selected
  });

  const { data: jobRoleData, isLoading: jobRoleLoading } = useGetEmployeeJobRoleReportQuery(selectedUserId, {
    skip: !selectedUserId, // Only call the hook when a user ID is selected
  });

  // Handle search input change
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Format user data when fetched
  useEffect(() => {
    if (data?.data) {
      const formattedData = data.data.map((item, index) => ({
        id: item.id,
        serial_number: index + 1,
        full_name: `${item.first_name} ${item.last_name}`,
      }));
      setFilteredData(formattedData);
    }
  }, [data]);

  // Handler for "Employee Training Need" button
  const handleTrainingNeedReport = (id) => {
    setSelectedUserId(id); // Set the selected user ID

    // Wait for the hook data to be available before triggering download
    if (trainingNeedLoading) {
      toast.info("Loading report...");
      return;
    }

    if (trainingNeedData?.status) {
      const fileUrl = trainingNeedData.data; // Extract the file URL from the response
      console.log("File URL:", fileUrl); // Check if the URL is correct in the console

      // Ensure the file URL is valid
      if (fileUrl) {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "Employee_Training_Need_Report.pdf"; // Set default file name for download

        // Check if the file URL is valid and accessible
        fetch(fileUrl, { method: "HEAD" })
          .then((response) => {
            if (response.ok) {
              // If the file is accessible, trigger the download
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toast.success("PDF generated successfully!");
            } else {
              toast.error("Failed to fetch the file. Please try again later.");
            }
          })
          .catch((error) => {
            console.error("Error fetching the file:", error);
            toast.error("Error occurred while downloading the report.");
          });
      } else {
        toast.error("File URL is missing.");
      }
    } else {
      toast.error("Failed to generate training need report.");
    }
  };

  // Handler for "Employee Job Role Report" button
  const handleJobRoleReport = (id) => {
    setSelectedUserId(id); // Set the selected user ID

    // Wait for the hook data to be available before triggering download
    if (jobRoleLoading) {
      toast.info("Loading report...");
      return;
    }

    if (jobRoleData?.status) {
      const fileUrl = jobRoleData.data; // Extract the file URL from the response
      console.log("Job Role Report File URL:", fileUrl); // Check if the URL is correct in the console

      // Ensure the file URL is valid
      if (fileUrl) {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "Employee_Job_Role_Report.pdf"; // Set default file name for download

        // Check if the file URL is valid and accessible
        fetch(fileUrl, { method: "HEAD" })
          .then((response) => {
            if (response.ok) {
              // If the file is accessible, trigger the download
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toast.success("Job Role Report generated successfully!");
            } else {
              toast.error("Failed to fetch the file. Please try again later.");
            }
          })
          .catch((error) => {
            console.error("Error fetching the file:", error);
            toast.error("Error occurred while downloading the report.");
          });
      } else {
        toast.error("File URL is missing.");
      }
    } else {
      toast.error("Failed to generate job role report.");
    }
  };

  // Handler for "Training Attendance Sheet" button
  const handleAttendanceSheetReport = (id) => {
    console.log(`Training Attendance Sheet clicked for User ID: ${id}`);
    toast.info(`Clicked on Training Attendance Sheet for User ID: ${id}`);
  };

  // Filter users based on the search term
  const filteredDataList = filteredData.filter(
    (user) => user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          onClick={() => handleTrainingNeedReport(params.row.id)} // Pass the row ID
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
          onClick={() => handleJobRoleReport(params.row.id)} // Pass the row ID
          startIcon={<DownloadIcon />}
        >
          Job Role
        </MDButton>
      ),
    },
    // {
    //   field: "attendance_sheet",
    //   headerName: "Training Attendance Sheet",
    //   flex: 1,
    //   headerAlign: "center",
    //   renderCell: (params) => (
    //     <MDButton
    //       variant="outlined"
    //       color="primary"
    //       size="small"
    //       onClick={() => handleAttendanceSheetReport(params.row.id)} // Pass the row ID
    //       startIcon={<DownloadIcon />}
    //     >
    //       Attendance Sheet
    //     </MDButton>
    //   ),
    // },
  ];

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
