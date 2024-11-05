import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
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
      { id: 3, email: "mike.jones@example.com", full_name: "Mike Jones", username: "mikejones", created_at: "2024-01-03" },
      { id: 4, email: "sarah.connor@example.com", full_name: "Sarah Connor", username: "sarahconnor", created_at: "2024-01-04" },
      { id: 5, email: "david.brown@example.com", full_name: "David Brown", username: "davidbrown", created_at: "2024-01-05" },
      { id: 6, email: "lisa.white@example.com", full_name: "Lisa White", username: "lisawhite", created_at: "2024-01-06" },
      { id: 7, email: "mark.taylor@example.com", full_name: "Mark Taylor", username: "marktaylor", created_at: "2024-01-07" },
      { id: 8, email: "paul.green@example.com", full_name: "Paul Green", username: "paulgreen", created_at: "2024-01-08" },
      { id: 9, email: "linda.black@example.com", full_name: "Linda Black", username: "lindablack", created_at: "2024-01-09" },
      { id: 10, email: "peter.james@example.com", full_name: "Peter James", username: "peterjames", created_at: "2024-01-10" },
    ];

    const formattedData = mockData.map((item, index) => ({
      serial_number: index + 1,
      email: item.email,
      full_name: item.full_name,
      username: item.username,
      created_at: item.created_at,
      action: item.id,
    }));
    
    setData(formattedData);
    
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddUser = () => {
    navigate("/add_update_user");
  };

  const filteredData = data.filter((user) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3 }}>
        <MDBox p={3} display="flex" alignItems="center">
          <MDInput
            label="Search"
            variant="outlined"
            size="small"
            sx={{ width: '250px', mr: 2 }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Users Listing
          </MDTypography>
          <MDButton variant="contained" color="primary" onClick={handleAddUser} sx={{ ml: 2 }}>
            Add User
          </MDButton>
        </MDBox>
        <TableContainer sx={{ width: '100%', mx: 'auto' }}>
      <Table sx={{ borderCollapse: 'collapse', width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell 
              sx={{ 
                fontWeight: 'bold', 
                border: '1px solid #ddd', 
                textAlign: 'center', 
                width: '10%', 
                padding: '8px 16px', 
                verticalAlign: 'middle',
                display: 'table-cell' // Ensures proper alignment
              }}
            >
              Sr. No.
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 'bold', 
                border: '1px solid #ddd', 
                textAlign: 'center', 
                width: '25%', 
                padding: '8px 16px', 
                verticalAlign: 'middle',
                display: 'table-cell' // Ensures proper alignment
              }}
            >
              Email
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 'bold', 
                border: '1px solid #ddd', 
                textAlign: 'center', 
                width: '25%', 
                padding: '8px 16px', 
                verticalAlign: 'middle',
                display: 'table-cell' // Ensures proper alignment
              }}
            >
              Full Name
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 'bold', 
                border: '1px solid #ddd', 
                textAlign: 'center', 
                width: '20%', 
                padding: '8px 16px', 
                verticalAlign: 'middle',
                display: 'table-cell' // Ensures proper alignment
              }}
            >
              Username
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 'bold', 
                border: '1px solid #ddd', 
                textAlign: 'center', 
                width: '10%', 
                padding: '8px 16px', 
                verticalAlign: 'middle',
                display: 'table-cell' // Ensures proper alignment
              }}
            >
              Date
            </TableCell>
            <TableCell 
              sx={{ 
                border: '1px solid #ddd', 
                textAlign: 'center', 
                width: '10%', 
                padding: '8px 16px', 
                verticalAlign: 'middle',
                display: 'table-cell' // Ensures proper alignment
              }}
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((user) => (
            <TableRow 
              key={user.action} 
              sx={{ 
                '&:hover': { backgroundColor: '#f5f5f5' },
                border: '1px solid #ddd' 
              }}
            >
              <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>{user.serial_number}</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>{user.email}</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>{user.full_name}</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>{user.username}</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>
                <IconButton
                  color="primary"
                  onClick={() => navigate(`/edit_user/${user.action}`)}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </Card>
    </MDBox>
  );
};

export default UsersListing;
