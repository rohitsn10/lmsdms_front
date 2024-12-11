import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useCreateInventoryMutation } from "api/auth/inventoryApi"; // Adjust this import path if needed
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField, Button } from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

function AddinventoryDialog({ open, handleClose }) {
  const [inventory_name, setInventoryName] = useState("");
  const [createinventory, { isLoading, isSuccess, isError, error }] = useCreateInventoryMutation();

  // Handle success and error effects
  useEffect(() => {
    if (isSuccess) {
      handleClose();
      setInventoryName(""); // Clear input on success
    }
  }, [isSuccess, handleClose]);

  const handleInventoryChange = (event) => {
    setInventoryName(event.target.value);
  };

  const handleSubmit = async () => {
    if (inventory_name) {
      try {
        // Send the inventory name with the expected key
        await createinventory({ inventory_name }).unwrap(); 
      } catch (err) {
        console.error("Failed to create inventory:", err);
      }
    }
  };

  const handleClear = () => {
    setInventoryName("");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <MDBox sx={{ textAlign: "center" }}>
        <MDTypography variant="h4" fontWeight="medium" color="#344767" mt={1}>
          Add Inventory
        </MDTypography>
      </MDBox>

      <form onSubmit={(e) => e.preventDefault()}>
        <DialogContent>
          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error?.data?.message || "Failed to create inventory. Please try again."}
            </Alert>
          )}

          <MDBox display="flex" justifyContent="flex-end">
            <MDButton
              variant="outlined"
              color="error"
              size="small"
              onClick={handleClear}
              sx={{ marginRight: "20px" }}
            >
              Clear
            </MDButton>
          </MDBox>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Inventory"
              variant="outlined"
              value={inventory_name}
              onChange={handleInventoryChange}
              helperText="Enter the inventory name"
              fullWidth
            />
          </FormControl>
        </DialogContent>

        <DialogActions>
          <MDButton onClick={handleClose} color="error" sx={{ marginRight: "10px" }}>
            Cancel
          </MDButton>
          <MDBox>
            <MDButton variant="gradient" color="submit" fullWidth onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : "Submit"}
            </MDButton>
          </MDBox>
        </DialogActions>
      </form>
    </Dialog>
  );
}

AddinventoryDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddinventoryDialog;
