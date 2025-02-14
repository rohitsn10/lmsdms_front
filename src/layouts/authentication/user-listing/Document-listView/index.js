import React, { useState, useEffect } from 'react'; // Import useState and useEffect from React
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MDBox from 'components/MDBox'; // Adjust the import path if necessary
import MDTypography from 'components/MDTypography';
import MDButton from "components/MDButton";
import { DataGrid } from '@mui/x-data-grid';
import { useUserIdWiseNoOfAttemptsMutation } from 'api/auth/userApi'; // Import the hook

const SOPDialog = ({ open, onClose, selectedUserid }) => {
  const [fetchAttempts, { data, isLoading, isError }] = useUserIdWiseNoOfAttemptsMutation();
  
  // State to store SOP data
  const [sopData, setSopData] = useState([]);

  // Fetch data based on userId when the dialog is opened
  useEffect(() => {
    if (open && selectedUserid) {
      // Trigger the hook to fetch the data
      fetchAttempts(selectedUserid);
    }
  }, [open, selectedUserid, fetchAttempts]);

  // If data is fetched successfully, format it for the DataGrid
  useEffect(() => {
    if (data && data.status && data.data) {
      const formattedData = data.data.map((item, index) => ({
        id: item.document_id,
        serial_number: index + 1,
        documentName: item.document_name,
        attempts: item.attempts,
        status: item.status,
      }));
      setSopData(formattedData);
    }
  }, [data]);

  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "documentName", headerName: "Document Name", flex: 1, headerAlign: "center" },
    { field: "attempts", headerName: "Attempts", flex: 1, headerAlign: "center" },
    { field: "status", headerName: "Status", flex: 1, headerAlign: "center" },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        SOP Details
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <MDBox p={3}>
          <MDTypography variant="h5" fontWeight="medium" sx={{ mb: 3, textAlign: "center" }}>
            SOP Documents
          </MDTypography>
          
          {/* Show loading state */}
          {isLoading && <MDTypography variant="h6" color="textSecondary">Loading SOP data...</MDTypography>}
          
          {/* Show error message */}
          {isError && <MDTypography variant="h6" color="error">Failed to fetch data. Please try again.</MDTypography>}

          {/* Display the DataGrid when data is available */}
          {data && !isLoading && !isError && (
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={sopData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
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
              />
            </div>
          )}
        </MDBox>
      </DialogContent>

      <DialogActions>
        <MDButton onClick={onClose} color="primary">
          Close
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

SOPDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedUserid: PropTypes.string.isRequired, // Ensure this is passed correctly
};

export default SOPDialog;
