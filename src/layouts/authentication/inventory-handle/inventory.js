import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useCreateInventoryMutation } from "api/auth/inventoryApi"; // Adjust this import path if needed
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

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
        // Send inventory name wrapped in an object as required by the backend
        await createinventory({ name: inventory_name }).unwrap();
      } catch (err) {
        console.error("Failed to create inventory:", err);
        // Optionally, display a toast or alert for error feedback
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Inventory</DialogTitle>
      <DialogContent>
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.data?.message || "Failed to create inventory. Please try again."}
          </Alert>
        )}
        <FormControl fullWidth margin="dense">
          <TextField
            label="Inventory"
            variant="outlined"
            value={inventory_name}
            onChange={handleInventoryChange}
            fullWidth
            sx={{ minWidth: 200, height: "3rem" }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddinventoryDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddinventoryDialog;
