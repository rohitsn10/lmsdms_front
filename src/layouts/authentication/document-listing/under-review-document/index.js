import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetDocumentDataOfStatusIdThreeQuery } from "api/auth/dashboardApi"; // Use the new API
import { useFetchDepartmentsQuery } from "api/auth/departmentApi";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import PreviewIcon from "@mui/icons-material/Preview";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { hasPermission } from "utils/hasPermission";
import PropTypes from "prop-types";
import { useAuth } from "hooks/use-auth";
import moment from "moment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ConditionalDialog from "../effective";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useFetchPermissionsByGroupIdQuery } from "api/auth/permissionApi";

const UnderReviewDocument = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Department Selector State
  const [selectedDateRange, setSelectedDateRange] = useState(""); // Date Range Selector State
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetching documents using the new API
  const { data, refetch, isLoading, isError } = useGetDocumentDataOfStatusIdThreeQuery({
    departmentId: selectedDepartment,
    startDate: startDate ? moment(startDate).format("DD-MM-YYYY") : "", // Format start date
    endDate: endDate ? moment(endDate).format("DD-MM-YYYY") : "", // Format end date
  }, {
    skip: !selectedDepartment, // Skip if no department is selected
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data: departmentData, isLoading: isDepartmentsLoading } = useFetchDepartmentsQuery();
  const group = user?.user_permissions?.group || {};
  const groupId = group.id;

 const { data: userPermissions = [], isError: permissionError } =
    useFetchPermissionsByGroupIdQuery(groupId?.toString(), {
      skip: !groupId,
    });
  useEffect(() => {
    if (selectedDepartment && startDate && endDate) {
      refetch();
    }
  }, [selectedDepartment, startDate, endDate, refetch]); // Add these dependencies to refetch when conditions change

  
  const documents = data?.data || [];// Extract documents from the new API response
console.log("-+---+-+--+------++-+--+",documents);
  const handleDialogOpen = (row) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClick = (params) => {
    if (!params || !params.row) {
      console.error("Invalid params object:", params);
      return; // Exit if params or row is missing
    }

    const { id, document_current_status, training_required, approval_status } = params.row;

    if (
      id === undefined ||
      document_current_status === undefined ||
      training_required === undefined ||
      approval_status === undefined
    ) {
      console.error("Missing data in params.row:", params.row);
      return;
    }

    navigate(
      `/document-view/${id}?status=${document_current_status}&training_required=${training_required},&approval_status=${approval_status}`
    );
  };

  const handleDateRangeChange = (event) => {
    const selectedRange = event.target.value;
    setSelectedDateRange(selectedRange);

    const today = new Date();

    if (selectedRange === "today") {
      setStartDate(today);
      setEndDate(today);
    } else if (selectedRange === "lastWeek") {
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - 7);
      setStartDate(lastWeekStart);
      setEndDate(today);
    } else if (selectedRange === "lastMonth") {
      const lastMonthStart = new Date(today);
      lastMonthStart.setMonth(today.getMonth() - 1);
      setStartDate(lastMonthStart);
      setEndDate(today);
    } else if (selectedRange === "lastYear") {
      const lastYearStart = new Date(today);
      lastYearStart.setFullYear(today.getFullYear() - 1);
      setStartDate(lastYearStart);
      setEndDate(today);
    } else if (selectedRange === "custom") {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const filteredData = documents.filter(
    (doc) =>
      doc.document_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.created_at.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rows = filteredData.map((doc, index) => ({
    ...doc,
    index,
    created_at: moment(doc.created_at).format("DD/MM/YY"),
  }));

  const columns = [
    {
      field: "index",
      headerName: "Sr.No.",
      flex: 0.3,
      headerAlign: "center",
      renderCell: (params) => <span>{params.row.index + 1}</span>,
      sortable: false,
      filterable: false,
    },
    {
      field: "document_title",
      headerName: "Title",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "document_type_name",
      headerName: "Type",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "document_number",
      headerName: "Document No.",
      flex: 0.55,
      headerAlign: "center",
    },
    {
      field: "version",
      headerName: "Version",
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "created_at",
      headerName: "Created Date",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "current_status_name",
      headerName: "Status",
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0.6,
      headerAlign: "center",
      renderCell: (params) => (
        <MDBox display="flex" gap={1}>
          {hasPermission(userPermissions, "document", "isChange") && (
            <IconButton color="primary" onClick={() => handleEditClick(params.row.id)}>
              <EditIcon />
            </IconButton>
          )}
          <IconButton color="primary" onClick={() => handleViewFile(params.row.selected_template_url)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => handleClick(params)}>
            <EditCalendarIcon />
          </IconButton>
        </MDBox>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching documents.</div>;

  if (isDepartmentsLoading) return <div>Loading Departments...</div>;

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center">
          {/* Department Dropdown */}
          <FormControl sx={{ minWidth: 180, mr: 2 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              label="Department"
              sx={{
                minWidth: 200,
                height: "2.5rem",
                ".MuiSelect-select": { padding: "0.45rem" },
              }}
            >
              {departmentData?.map((department) => (
                <MenuItem key={department.id} value={department.id}>
                  {department.department_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <MDInput
            label="Search"
            variant="outlined"
            size="small"
            sx={{ width: "250px", mr: 2 }}
            value={searchTerm}
            onChange={handleSearch}
          />

          <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center", mr: 28 }}>
            Under Review Listing
          </MDTypography>

          {/* Date Range Dropdown */}
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={selectedDateRange}
              onChange={handleDateRangeChange}
              label="Date Range"
              sx={{
                minWidth: 200,
                height: "2.5rem",
                ".MuiSelect-select": { padding: "0.45rem" },
              }}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="lastWeek">Last Week</MenuItem>
              <MenuItem value="lastMonth">Last Month</MenuItem>
              <MenuItem value="lastYear">Last Year</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>

          {selectedDateRange === "custom" && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MDBox display="flex" gap={2} mt={2}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newDate) => setStartDate(newDate)}
                  renderInput={(params) => <MDInput {...params} />}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newDate) => setEndDate(newDate)}
                  renderInput={(params) => <MDInput {...params} />}
                />
              </MDBox>
            </LocalizationProvider>
          )}
        </MDBox>

        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={rows || []}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                  textAlign: "center",
                  justifyContent: "center",
                },
                "& .MuiDataGrid-cell": {
                  textAlign: "center",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  textAlign: "center",
                  width: "100%",
                },
              }}
            />
          </div>
        </MDBox>
      </Card>

      <ConditionalDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={() => console.log("Confirmed for row:", selectedRow)}
        trainingStatus={selectedRow?.training_required || "false"}
        documentId={selectedRow?.id || ""}
        revisionMonth={selectedRow?.revision_month} // Pass revisionMonth as a prop
      />
    </MDBox>
  );
};

export default UnderReviewDocument;
