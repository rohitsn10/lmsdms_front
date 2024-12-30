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
    import moment from "moment";
    import { useFetchTrainingsQuery } from "apilms/trainingApi"; // Update this path as needed
    import VisibilityIcon from '@mui/icons-material/Visibility';
    
    const TrainingListing = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // Fetch training data using the API query hook
    const { data, error, isLoading,refetch } = useFetchTrainingsQuery();


     useEffect(() => {
          refetch();
        }, [location.key]);
        
    const handleAddTraining = () => {
        navigate("/add-training");
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleEditTraining = (item) => {
        navigate("/edit-training", { state: { item } });
    };
    
    const handleview = (item) => {
        const documentUrl = item;  // Ensure the correct field is used
    
        if (documentUrl) {
            console.log("Passing training_document:", item);
            navigate("/LMS-Document", { state: { documentView: item } });
        } else {
            console.error("training_document is undefined or missing for this item", item);
        }
    };
    
    

    // Ensure that data is an array and filter it
    const filteredData = (Array.isArray(data?.data) ? data.data : [])
    .filter((item) =>
      item.training_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((item, index) => ({
      id: item.id,
      serial_number: index + 1,
      created_by_name: item.created_by_name,
      plant_name: item.plant_name,
      training_name: item.training_name,
      training_type_name: item.training_type_name,
      training_number: item.training_number,
      training_version: item.training_version,
      refresher_time: moment(item.refresher_time).format("DD-MM-YY"),
      training_created_at: moment(item.training_created_at).format("DD-MM-YY"),
      schedule_date: moment(item.schedule_date).format("DD-MM-YY"),
      training_status: item.training_status,
      documentView: item.training_document,
    }));
  

    const columns = [
        { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
        { field: "created_by_name", headerName: "Created By", flex: 1, headerAlign: "center" },
        { field: "plant_name", headerName: "Plant Name", flex: 1, headerAlign: "center" },
        { field: "training_name", headerName: "Training Name", flex: 1, headerAlign: "center" },
        { field: "training_number", headerName: "Training Number", flex: 1.2, headerAlign: "center" },
        { field: "training_type_name", headerName: "Training Type", flex: 1.2, headerAlign: "center" },
        { field: "refresher_time", headerName: "Refresher Time", flex: 1, headerAlign: "center" },
        { field: "training_version", headerName: "Version", flex: 1, headerAlign: "center" },
        { field: "training_created_at", headerName: "Created Date", flex: 1, headerAlign: "center" },
        { field: "schedule_date", headerName: "Schedule Date", flex: 0.8, headerAlign: "center" },
        { field: "training_status", headerName: "Status", flex: 1, headerAlign: "center" },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            headerAlign: "center",
            renderCell: (params) => (
                <MDBox display="flex" gap={1}>
                    {/* Edit button */}
                    <IconButton
                        color="primary"
                        onClick={() => handleEditTraining(params.row)} // Pass the training details
                    >
                        <EditIcon />
                    </IconButton>
        
                    {/* Visibility button */}
                    <IconButton
                        color="primary"
                        onClick={() => handleview(params.row.documentView)} // Handle view action
                    >
                        <VisibilityIcon />
                    </IconButton>
                </MDBox>
            ),
            sortable: false,
            filterable: false,
        }
    ];

    return (
        <MDBox p={3}>
        <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
            <MDBox p={3} display="flex" alignItems="center">
            <MDInput
                label="Search Training"
                variant="outlined"
                size="small"
                sx={{ width: "250px", mr: 2 }}
                value={searchTerm}
                onChange={handleSearch}
            />
            <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center" }}>
                Training Listing
            </MDTypography>
            <MDButton
                variant="contained"
                color="primary"
                onClick={handleAddTraining}
                sx={{ ml: 2 }}
            >
                Add Training
            </MDButton>
            </MDBox>

            {isLoading ? (
            <MDTypography variant="h5" sx={{ textAlign: "center" }}>Loading...</MDTypography>
            ) : error ? (
            <MDTypography variant="h5" sx={{ textAlign: "center", color: "red" }}>
                Error fetching training data
            </MDTypography>
            ) : (
            <MDBox display="flex" justifyContent="center" p={2}>
                <div style={{ height: 500, width: "100%", overflow: "auto" }}>
                <DataGrid
                    rows={filteredData}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                    sx={{
                    minWidth: 1500, // Ensure the minimum width allows for scrolling
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
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    },
                    }}
                />
                </div>
            </MDBox>
            )}
        </Card>
        </MDBox>
    );
    };

    export default TrainingListing;
