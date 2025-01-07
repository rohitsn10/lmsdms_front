import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetDocumentDataOfStatusIdTwoQuery } from "api/auth/dashboardApi"; // Use the new API
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

const SavedraftDocument = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { data, refetch, isLoading, isError } = useGetDocumentDataOfStatusIdTwoQuery({
    departmentId: selectedDepartment,
    startDate: startDate ? moment(startDate).format("DD-MM-YYYY") : "",
    endDate: endDate ? moment(endDate).format("DD-MM-YYYY") : "",
  });

  const documents = data?.saveDraftdata || [];

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
  }, [selectedDepartment, startDate, endDate, refetch]);

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
      return;
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

  const formatDate = (date) => {
    if (date) {
      return moment(date).format("DD/MM/YYYY");
    }
    return "";
  };

  const handleDateRangeChange = (event) => {
    const selectedRange = event.target.value;
    setSelectedDateRange(selectedRange);

    const today = new Date();
    let startDate, endDate, displayRange;

    if (selectedRange === "today") {
      startDate = today;
      endDate = today;
      displayRange = `${formatDate(startDate)} to ${formatDate(endDate)}`;
    } else if (selectedRange === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      startDate = yesterday;
      endDate = yesterday;
      displayRange = `${formatDate(startDate)} to ${formatDate(endDate)}`;
    } else if (selectedRange === "last7Days") {
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 7);
      startDate = last7Days;
      endDate = today;
      displayRange = `${formatDate(startDate)} to ${formatDate(endDate)}`;
    } else if (selectedRange === "last30Days") {
      const last30Days = new Date(today);
      last30Days.setDate(today.getDate() - 30);
      startDate = last30Days;
      endDate = today;
      displayRange = `${formatDate(startDate)} to ${formatDate(endDate)}`;
    } else if (selectedRange === "thisMonth") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      displayRange = `${formatDate(startDate)} to ${formatDate(endDate)}`;
    } else if (selectedRange === "lastMonth") {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      startDate = lastMonth;
      displayRange = `${formatDate(startDate)} to ${formatDate(endDate)}`;
    } else if (selectedRange === "lastYear") {
      startDate = new Date(today.getFullYear() - 1, 0, 1);
      endDate = new Date(today.getFullYear() - 1, 11, 31);
      displayRange = `${formatDate(startDate)} to ${formatDate(endDate)}`;
    } else if (selectedRange === "custom") {
      setStartDate(null);
      setEndDate(null);
      return;
    }

    setStartDate(startDate);
    setEndDate(endDate);

    // Set the display range value
    setSelectedDateRange(displayRange);
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

          <MDTypography
            variant="h4"
            fontWeight="medium"
            sx={{ flexGrow: 1, textAlign: "center", mr: 28 }}
          >
            Save Draft Listing
          </MDTypography>

          {/* Date Range Dropdown */}
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={selectedDateRange} // Display the formatted date range as a string
              onChange={handleDateRangeChange}
              label="Date Range"
              sx={{
                minWidth: 200,
                height: "2.5rem",
                ".MuiSelect-select": { padding: "0.45rem" },
              }}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="yesterday">Yesterday</MenuItem>
              <MenuItem value="last7Days">Last 7 Days</MenuItem>
              <MenuItem value="last30Days">Last 30 Days</MenuItem>
              <MenuItem value="thisMonth">This Month</MenuItem>
              <MenuItem value="lastMonth">Last Month</MenuItem>
              <MenuItem value="lastYear">Last Year</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>

          {startDate && endDate && (
            <MDTypography variant="h6" sx={{ marginLeft: 2 }}>
              {formatDate(startDate)} to {formatDate(endDate)}
            </MDTypography>
          )}

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

        <MDBox display="flex" justifyContent="center" sx={{ height: 500 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            autoHeight
          />
        </MDBox>
      </Card>
    </MDBox>
  );
};

export default SavedraftDocument;
