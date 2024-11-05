import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

const UsersListing = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data for demonstration
    const mockData = [
      { id: 1, email: "john.doe@example.com", full_name: "John Doe", username: "johndoe", created_at: "2024-01-01" },
      { id: 2, email: "jane.smith@example.com", full_name: "Jane Smith", username: "janesmith", created_at: "2024-01-02" },
      // ...additional mock data
    ];

    const formattedData = mockData.map((item, index) => ({
      id: item.id,
      serial_number: index + 1,
      email: item.email,
      full_name: item.full_name,
      username: item.username,
      created_at: new Date(item.created_at).toLocaleDateString(),
    }));

    setData(formattedData);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddUser = () => {
    navigate("/add_update_user");
  };

  const filteredData = data.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: "serial_number", headerName: "Sr. No.", width: 100 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "full_name", headerName: "Full Name", width: 200 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "created_at", headerName: "Date", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 100,
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
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={filteredData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            sx={{ border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>
      </Card>
    </MDBox>
  );
};

export default UsersListing;
