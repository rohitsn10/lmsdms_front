import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchDocumentsQuery } from 'api/auth/documentApi'; // Import the new hook
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

const DocumentListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Use the fetchDocumentsQuery hook
  const { data, isLoading, isError } = useFetchDocumentsQuery();

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddDocument = () => {
    navigate("/add_update_document");
  };

  const filteredData = data?.data?.filter((doc) =>
    doc.document_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_number.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching documents.</div>;

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
            Document Listing
          </MDTypography>
          <MDButton variant="contained" color="primary" onClick={handleAddDocument} sx={{ ml: 2 }}>
            Add Document
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
                    display: 'table-cell'
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
                    display: 'table-cell'
                  }}
                >
                  Title
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    border: '1px solid #ddd', 
                    textAlign: 'center', 
                    width: '20%', 
                    padding: '8px 16px', 
                    verticalAlign: 'middle',
                    display: 'table-cell'
                  }}
                >
                  Type
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    border: '1px solid #ddd', 
                    textAlign: 'center', 
                    width: '20%', 
                    padding: '8px 16px', 
                    verticalAlign: 'middle',
                    display: 'table-cell'
                  }}
                >
                  Document No.
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    border: '1px solid #ddd', 
                    textAlign: 'center', 
                    width: '10%', 
                    padding: '8px 16px', 
                    verticalAlign: 'middle',
                    display: 'table-cell'
                  }}
                >
                  Created Date
                </TableCell>
                <TableCell 
                  sx={{ 
                    border: '1px solid #ddd', 
                    textAlign: 'center', 
                    width: '10%', 
                    padding: '8px 16px', 
                    verticalAlign: 'middle',
                    display: 'table-cell'
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((doc, index) => (
                <TableRow 
                  key={doc.id} 
                  sx={{ 
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    border: '1px solid #ddd' 
                  }}
                >
                  <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>{index + 1}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>{doc.document_title}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>{doc.document_type_name}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>{doc.document_number}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>{doc.formatted_created_at}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/edit_document/${doc.id}`)}
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

export default DocumentListing;
