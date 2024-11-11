import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MDInput from 'components/MDInput';
import PropTypes from "prop-types";
import MDButton from 'components/MDButton';
import { useUpdateInventoryMutation} from 'api/auth/inventoryApi';

const UpdateinventoryDialog = ({ open, handleClose, inventoryId, inventoryName }) => {
  const [inventory_name, setinventory] = useState(inventoryName);

  const [updateinventory] = useUpdateInventoryMutation();

  useEffect(() => {
    setinventory(inventoryName);
  }, [inventoryName]);

  const handleUpdate = async () => {
    if (inventory_name.trim()) {
      try {
        const response = await updateinventory({ id: inventoryId, inventory_name }).unwrap();
        if (response.inventory_name) {
          handleClose();
        } else {
          console.error('Error updating inventory:', response.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error updating inventory:', error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Inventory</DialogTitle>
      <DialogContent>
        <MDInput
          value={inventory_name}
          onChange={(e) => setinventory(e.target.value)}
          fullWidth

        />
      </DialogContent>
      <DialogActions>
        <MDButton onClick={handleClose} color="primary">
          Cancel
        </MDButton>
        <MDButton onClick={handleUpdate} color="primary">
          Update
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

// Define PropTypes for the component
UpdateinventoryDialog.propTypes = {
  open: PropTypes.bool.isRequired,           
  handleClose: PropTypes.func.isRequired,    
  inventoryId: PropTypes.string.isRequired,   
  inventoryName: PropTypes.string.isRequired   
};


export default UpdateinventoryDialog;
