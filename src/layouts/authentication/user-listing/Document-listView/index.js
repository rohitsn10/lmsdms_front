import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from "components/MDButton";
import { DataGrid } from '@mui/x-data-grid';
import { useUserIdWiseNoOfAttemptsMutation } from 'api/auth/userApi';
import AnswerDialog from './AnswerDialog'; // Import AnswerDialog

const SOPDialog = ({ open, onClose, selectedUserid }) => {
  const [fetchAttempts, { data, isLoading, isError }] = useUserIdWiseNoOfAttemptsMutation();
  const [sopData, setSopData] = useState([]);

  // State to handle AnswerDialog
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    if (open && selectedUserid) {
      fetchAttempts(selectedUserid);
    }
  }, [open, selectedUserid, fetchAttempts]);

  useEffect(() => {
    if (data?.status && data?.data) {
      const formattedData = data.data.map((item) => ({
        id: item.id,
        user: item.user, // Added user ID
        document: item.document, // Added document ID
        serial_number: item.id,
        documentName: item.document_name,
        obtainedMarks: item.obtain_marks || '0',
        totalMarks: item.total_marks || '0',
        timeTaken: item.total_taken_time ? `${item.total_taken_time} mins` : 'N/A',
        status: item.is_pass ? "Pass" : "Fail",
        attemptDate: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'
      }));
      setSopData(formattedData);
    }
  }, [data]);

  const handleOpenAnswerDialog = (userId, documentId) => {
    setSelectedUser(userId);
    setSelectedDocument(documentId);
    setAnswerDialogOpen(true);
  };

  const handleCloseAnswerDialog = () => {
    setAnswerDialogOpen(false);
  };

  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "documentName", headerName: "Document Name", flex: 1.5, headerAlign: "center" },
    { 
      field: "obtainedMarks", 
      headerName: "Marks Obtained", 
      flex: 1, 
      headerAlign: "center",
      renderCell: (params) => (
        <span>{params.row.obtainedMarks}/{params.row.totalMarks}</span>
      )
    },
    { field: "timeTaken", headerName: "Time Taken", flex: 1, headerAlign: "center" },
    { field: "status", headerName: "Status", flex: 0.8, headerAlign: "center" },
    { field: "attemptDate", headerName: "Attempt Date", flex: 1, headerAlign: "center" },
    {
      field: "answers",
      headerName: "Answers",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <MDButton
          color="primary"
          onClick={() => handleOpenAnswerDialog(params.row.user, params.row.document)}
        >
          View Answers
        </MDButton>
      ),
    }
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
            SOP Attempt History
          </MDTypography>
          
          {isLoading && (
            <MDTypography variant="h6" color="textSecondary">
              Loading SOP data...
            </MDTypography>
          )}
          
          {isError && (
            <MDTypography variant="h6" color="error">
              Failed to fetch data. Please try again.
            </MDTypography>
          )}

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
                    fontWeight: "bold"
                  },
                  "& .MuiDataGrid-cell": {
                    textAlign: "center"
                  }
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

      {/* Answer Dialog */}
      <AnswerDialog
        open={answerDialogOpen}
        onClose={handleCloseAnswerDialog}
        userId={selectedUser}
        documentId={selectedDocument}
      />
    </Dialog>
  );
};

SOPDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedUserid: PropTypes.string.isRequired,
};

export default SOPDialog;
