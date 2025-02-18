import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import moment from "moment";
import { useFetchDocumentsQuery, useFetchDocumentVersionListQuery } from "api/auth/documentApi";
import { FormLabel } from "@mui/material";

const ArchivedListing = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDocumentId, setSelectedDocumentId] = useState("");
    const navigate = useNavigate();

    const { data: documents = [], isLoading: documentsLoading } = useFetchDocumentsQuery();
    // Always call the hook, but pass null when no document is selected
    const { data: versions = [], isLoading: versionsLoading } = useFetchDocumentVersionListQuery(
        selectedDocumentId || null
    );

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDocumentSelect = (event) => {
        setSelectedDocumentId(event.target.value);
    };

    const filteredDocuments = documents?.documents?.filter(doc =>
        doc.document_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.document_number.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const versionColumns = [
        { field: "version_no", headerName: "Version", flex: 1, headerAlign: "center" },
        { field: "department_id", headerName: "Department ID", flex: 1, headerAlign: "center" },
        { field: "user", headerName: "User ID", flex: 1, headerAlign: "center" },
        {
            field: "front_file_url",
            headerName: "Document",
            flex: 1.5,
            headerAlign: "center",
            renderCell: (params) => (
                <a
                    href={params.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#1976d2', textDecoration: 'underline' }}
                >
                    View Document
                </a>
            ),
        },
    ];

    const formattedVersions = (selectedDocumentId && versions) ? versions.map((version, index) => ({
        id: index,
        ...version
    })) : [];

    return (
        <MDBox p={3}>
            <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
                <MDBox p={3}>
                    <MDTypography variant="h4" fontWeight="medium" sx={{ textAlign: "center", mb: 3 }}>
                        Archived Listing
                    </MDTypography>
                    
                    <MDBox display="flex" alignItems="center" gap={2} mb={3}>
                        {/* <MDInput
                            label="Search Documents"
                            variant="outlined"
                            size="small"
                            sx={{ width: "250px" }}
                            value={searchTerm}
                            onChange={handleSearch}
                        /> */}
                        <FormLabel>Select Document:</FormLabel>
                        <FormControl sx={{ width: "400px",padding:'10px'}}>
                            {/* <InputLabel id="document-select-label">Select Document</InputLabel> */}
                            <Select
                                labelId="document-select-label"
                                value={selectedDocumentId}
                                onChange={handleDocumentSelect}
                                size="small"
                                // label="Select Document"
                                sx={{
                                    padding:'10px'
                                }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {filteredDocuments.map((doc) => (
                                    <MenuItem key={doc.id} value={doc.id}>
                                        {doc.document_title} ({doc.document_number})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </MDBox>

                    <MDBox display="flex" justifyContent="center">
                        <div style={{ height: 400, width: "100%" }}>
                            <DataGrid
                                rows={formattedVersions}
                                columns={versionColumns}
                                pageSize={5}
                                rowsPerPageOptions={[5, 10, 20]}
                                disableSelectionOnClick
                                loading={versionsLoading}
                                sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    "& .MuiDataGrid-columnHeaders": {
                                        backgroundColor: "#f5f5f5",
                                        fontWeight: "bold",
                                    },
                                    "& .MuiDataGrid-cell": {
                                        textAlign: "center",
                                    },
                                }}
                                components={{
                                    NoRowsOverlay: () => (
                                        <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
                                            <MDTypography>
                                                {selectedDocumentId 
                                                    ? "No versions found for this document" 
                                                    : "Please select a document to view its versions"}
                                            </MDTypography>
                                        </MDBox>
                                    ),
                                }}
                            />
                        </div>
                    </MDBox>
                </MDBox>
            </Card>
        </MDBox>
    );
};

export default ArchivedListing;