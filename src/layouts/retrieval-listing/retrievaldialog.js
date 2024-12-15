import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Select, Button } from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function PrintRetrievalDialog({ open, handleClose, retrievalOptions, onRetrieve }) {
  const [selectedRetrieval, setSelectedRetrieval] = useState("");

  const handleRetrievalChange = (event) => {
    setSelectedRetrieval(event.target.value);
  };

  const handleRetrieve = () => {
    if (selectedRetrieval) {
      onRetrieve(selectedRetrieval);
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <MDBox sx={{ textAlign: "center" }}>
        <MDTypography variant="h4" fontWeight="medium" color="#344767" mt={1}>
          Print Retrieval
        </MDTypography>
      </MDBox>

      <form onSubmit={(e) => e.preventDefault()}>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <Select
              value={selectedRetrieval}
              onChange={handleRetrievalChange}
              displayEmpty
              variant="outlined"
              sx={{
                    minWidth: 200,
                    height: "3rem",
                    ".MuiSelect-select": {
                      padding: "0.75rem",
                    },
                  }}
            >
              <MenuItem value="" disabled>
                Select Retrieval Number
              </MenuItem>
              {retrievalOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

      <DialogActions>
              <MDButton onClick={handleClose} color="error" sx={{ marginRight: "10px" }}>
                Cancel
              </MDButton>
              <MDBox>
                <MDButton variant="gradient" color="submit" fullWidth onClick={handleRetrieve}>
                  Submit
                </MDButton>
              </MDBox>
            </DialogActions>
      </form>
    </Dialog>
  );
}

PrintRetrievalDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  retrievalOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onRetrieve: PropTypes.func.isRequired,
};

export default PrintRetrievalDialog;
