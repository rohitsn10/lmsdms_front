import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useUserListQuery } from 'api/auth/userApi'; // Import the user list query

const UsersListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data, error, isLoading } = useUserListQuery(); // Fetch user list

  // Handle loading state
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching users</div>;

  const formattedData = data.data.map((item, index) => ({
    id: item.id,
    serial_number: index + 1,
    email: item.email || "N/A", // Handle potential null values
    full_name: item.first_name ? `${item.first_name} ${item.last_name || ''}`.trim() : "N/A",
    username: item.username || "N/A",
    created_at: new Date(item.created_at).toLocaleDateString(), // Adjust if necessary
  }));

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddUser = () => {
    navigate("/add_update_user");
  };

  const filteredData = formattedData.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: "serial_number", headerName: "Sr. No.", width: 100, headerAlign: 'center' },
    { field: "email", headerName: "Email", width: 200, headerAlign: 'center' },
    { field: "full_name", headerName: "Full Name", width: 200, headerAlign: 'center' },
    { field: "username", headerName: "Username", width: 150, headerAlign: 'center' },
    // Assuming 'created_at' is not in the response. You may want to adjust based on your actual data.
    { field: "created_at", headerName: "Date", width: 150, headerAlign: 'center' },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      headerAlign: 'center',
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => navigate(`/edit_user/${params.row.id}`)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3 }}>
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
            Users Listing
          </MDTypography>
          <MDButton variant="contained" color="primary" onClick={handleAddUser} sx={{ ml: 2 }}>
            Add User
          </MDButton>
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={filteredData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              sx={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                '& .MuiDataGrid-columnHeaders': {
                  display: 'flex',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-cell': {
                  textAlign: 'center',
                },
              }}
            />
          </div>
        </MDBox>
      </Card>
    </MDBox>
  );
};

export default UsersListing;
