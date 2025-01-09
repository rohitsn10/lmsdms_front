import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { useFetchArchivedItemsQuery } from "api/auth/archivedListApi"; 
import moment from "moment";

const ArchivedListing = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const { data: archivedItems = [], isLoading, error } = useFetchArchivedItemsQuery();

    if (isLoading) return <div>Loading archived items...</div>;
    if (error) return <div>Error loading archived items: {error.message}</div>;

    const formattedData = archivedItems.map((item, index) => ({
        id: item.id,
        serial_number: index + 1,
        title: item.title || "N/A",
        type: item.type || "N/A",
        document_no: item.document_no || "N/A",
        version: item.version || "N/A",
        created_date: moment(item.created_date).format("DD/MM/YY"),
        status: item.status || "N/A",
    }));

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleViewItem = (item) => {
        navigate("/view-archived-item", { state: { item } });
    };

    const filteredData = formattedData.filter(
        (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.document_no.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
        { field: "title", headerName: "Title", flex: 1, headerAlign: "center" },
        { field: "type", headerName: "Type", flex: 1, headerAlign: "center" },
        { field: "document_no", headerName: "Document No.", flex: 1, headerAlign: "center" },
        { field: "version", headerName: "Version", flex: 0.5, headerAlign: "center" },
        { field: "created_date", headerName: "Created Date", flex: 0.75, headerAlign: "center" },
        { field: "status", headerName: "Status", flex: 0.75, headerAlign: "center" },
        {
            field: "action",
            headerName: "Action",
            flex: 0.5,
            headerAlign: "center",
            renderCell: (params) => (
                <IconButton color="primary" onClick={() => handleViewItem(params.row)}>
                    <VisibilityIcon />
                </IconButton>
            ),
        },
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
                        Archived Listing
                    </MDTypography>
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

export default ArchivedListing;
