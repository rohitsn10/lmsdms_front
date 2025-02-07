import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import PropTypes from "prop-types"; 
import { useFetchParentDocumentsQuery } from "api/auth/documentApi";

const ChildDocumentsDialog = ({ open, onClose, documentId }) => {
  const { data, error, isLoading, refetch } = useFetchParentDocumentsQuery(documentId, {
    skip: !open, 
  });
//   console.log("what i get in",documentId)
  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);
  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "document_name", headerName: "Document Name", flex: 1, headerAlign: "center" },
  ];

  const filteredData = data
    ? data.map((item, index) => ({
        ...item,
        serial_number: index + 1, 
      }))
    : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <MDTypography variant="h5" fontWeight="medium" color="#344767" sx={{ display: "flex", alignItems: "center" }}>
          Child Documents
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close" sx={{ marginLeft: "auto" }}>
            <CloseIcon />
          </IconButton>
        </MDTypography>
      </DialogTitle>
      <DialogContent>
        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 400, width: "100%" }}>
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error loading data.</div>
            ) : (
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
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                }}
              />
            )}
          </div>
        </MDBox>
      </DialogContent>
      <DialogActions>
        <MDBox display="flex" justifyContent="center" p={2}>
          <MDButton onClick={onClose} variant="contained" color="primary">
            Close
          </MDButton>
        </MDBox>
      </DialogActions>
    </Dialog>
  );
};
ChildDocumentsDialog.propTypes = {
  open: PropTypes.bool.isRequired, 
  onClose: PropTypes.func.isRequired, 
  documentId: PropTypes.number.isRequired, 
};

export default ChildDocumentsDialog;
