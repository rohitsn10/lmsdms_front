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

const DocumentListing = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data for demonstration
    const mockData = [
      { id: 1, title: "Project Proposal", type: "Proposal", document_no: "DOC-001", created_at: "2024-01-01" },
      { id: 2, title: "Budget Report", type: "Report", document_no: "DOC-002", created_at: "2024-01-02" },
      { id: 3, title: "Meeting Minutes", type: "Minutes", document_no: "DOC-003", created_at: "2024-01-03" },
      { id: 4, title: "Design Document", type: "Design", document_no: "DOC-004", created_at: "2024-01-04" },
      { id: 5, title: "User Guide", type: "Guide", document_no: "DOC-005", created_at: "2024-01-05" },
      { id: 6, title: "Technical Specification", type: "Specification", document_no: "DOC-006", created_at: "2024-01-06" },
      { id: 7, title: "Audit Report", type: "Report", document_no: "DOC-007", created_at: "2024-01-07" },
      { id: 8, title: "Risk Assessment", type: "Assessment", document_no: "DOC-008", created_at: "2024-01-08" },
      { id: 9, title: "Training Material", type: "Material", document_no: "DOC-009", created_at: "2024-01-09" },
      { id: 10, title: "Final Report", type: "Report", document_no: "DOC-010", created_at: "2024-01-10" },
    ];

    const formattedData = mockData.map((item, index) => ({
      serial_number: index + 1,
      title: item.title,
      type: item.type,
      document_no: item.document_no,
      created_at: item.created_at,
      action: item.id,
    }));

    setData(formattedData);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddDocument = () => {
    navigate("/add_update_document");
  };

  const filteredData = data.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_no.toLowerCase().includes(searchTerm.toLowerCase())
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
              {filteredData.map((doc) => (
                <TableRow 
                  key={doc.action} 
                  sx={{ 
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    border: '1px solid #ddd' 
                  }}
                >
                  <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>{doc.serial_number}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>{doc.title}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>{doc.type}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>{doc.document_no}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px 16px', display: 'table-cell' }}>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/edit_document/${doc.action}`)}
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
