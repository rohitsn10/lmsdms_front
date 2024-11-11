import React, { useState } from "react";
import PropTypes from "prop-types";
import { useCreateinventoryMutation } from "api/auth/inventoryApi"; // Assuming the inventoryApi is placed in services folder
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField, Button } from "@mui/material";

function AddinventoryDialog({ open, handleClose }) {
  const [inventory_name, setinventory] = useState("");
  const [createinventory, { isLoading, isSuccess, isError, error }] = useCreateinventoryMutation();

  const handleinventoryChange = (event) => {
    setinventory(event.target.value);
  };

  const handleSubmit = async () => {
    if (inventory_name) {
      try {
        // Call the API to create a new inventory
        await createinventory(inventory_name).unwrap();
        handleClose(); // Close dialog after successful submission
      } catch (err) {
        console.error("Failed to create inventory:", err);
        // Handle errors, e.g., show a toast notification or an error message
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Inventory</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <TextField
            label="inventory"
            variant="outlined"
            value={inventory_name}
            onChange={handleinventoryChange}
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
          {isLoading ? "Submitting..." : "Submit"}
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
