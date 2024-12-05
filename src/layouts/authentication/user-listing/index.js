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
import { useUserListQuery } from 'api/auth/userApi'; 
import { useFetchPermissionsByGroupIdQuery } from "api/auth/permissionApi"; 
import { useAuth } from "hooks/use-auth"; 
import { hasPermission } from "utils/hasPermission"; 
const UsersListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user, role } = useAuth(); 
  const { data, error, isLoading } = useUserListQuery(); 

  const group = user?.user_permissions?.group || {};
  const groupId = group.id;
 
  
  const { data: userPermissions = [], isError: permissionError } = useFetchPermissionsByGroupIdQuery(groupId?.toString(), {
    skip: !groupId, // Ensure it skips if groupId is missing
  });

  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching users</div>;

  const formattedData = data.data.map((item, index) => ({
    id: item.id,
    serial_number: index + 1,
    email: item.email || "N/A", 
    full_name: item.first_name ? `${item.first_name} ${item.last_name || ''}`.trim() : "N/A",
    username: item.username || "N/A",
    created_at: new Date(item.created_at).toLocaleDateString(), 
  }));

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddUser = () => {
    navigate("/add-user");
  };

  const handleEditUser = (user) => {
    navigate("/edit-user", { state: { user } });
  };

  const filteredData = formattedData.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: 'center' },
    { field: "email", headerName: "Email", flex: 1, headerAlign: 'center' },
    { field: "full_name", headerName: "Full Name", flex: 1, headerAlign: 'center' },
    { field: "username", headerName: "Username", flex: 0.75, headerAlign: 'center' },
    { field: "created_at", headerName: "Date", flex: 0.75, headerAlign: 'center' },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: 'center',
      renderCell: (params) => (
        hasPermission(userPermissions, "customuser", "isChange") ? (
          <IconButton color="primary" onClick={() => handleEditUser(params.row)}>
            <EditIcon />
          </IconButton>
        ) : null
      ),
    },
  ];

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: 'auto', marginRight: 0 }}>
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
          {hasPermission(userPermissions, "customuser", "isAdd") && (
            <MDButton variant="contained" color="primary" onClick={handleAddUser} sx={{ ml: 2 }}>
              Add User
            </MDButton>
          )}
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
