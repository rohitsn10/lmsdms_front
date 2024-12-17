import React from "react";
import PropTypes from "prop-types";
import { Dialog, DialogActions, DialogContent, IconButton } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";

const ApprovedRetrievalListingDialog = ({ open, handleClose, approvedRetrievals = [] }) => {

  // Columns for DataGrid
  const columns = [
    {
      field: "serial_number",
      headerName: "Sr. No.",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => params.row.serial_number ?? "-",
    },
    {
      field: "unit_no",
      headerName: "Unit No.",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => params.row.unit_no ?? "-",
    },
    {
      field: "approved_date",
      headerName: "Approved Date",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => moment(params.row.approved_date).format("YYYY-MM-DD") ?? "-",
    },
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <MDBox sx={{ textAlign: "center" }}>
        <MDTypography variant="h4" fontWeight="medium" color="#344767" mt={1}>
          Approved Retrieval Listing
        </MDTypography>
      </MDBox>

      <DialogContent>
        {approvedRetrievals.length === 0 ? (
          <MDTypography>No approved retrievals available.</MDTypography>
        ) : (
          <MDBox p={2}>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={approvedRetrievals.map((item, index) => ({
                  ...item,
                  serial_number: index + 1,
                }))}
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
          </MDBox>
        )}
      </DialogContent>

      <DialogActions>
        <MDButton onClick={handleClose} color="error" sx={{ marginRight: "10px" }}>
          Close
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

ApprovedRetrievalListingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  approvedRetrievals: PropTypes.array.isRequired,
};

export default ApprovedRetrievalListingDialog;
