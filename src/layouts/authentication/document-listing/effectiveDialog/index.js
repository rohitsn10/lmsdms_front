import React from 'react';
import PropTypes from 'prop-types';  // Import PropTypes
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import MDButton from 'components/MDButton';
function EffectiveDialog({ openDialog, selectedRow, handleCloseDialog, handleConfirmEffective }) {
  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>Confirm Effective Action</DialogTitle>
      <DialogContent>
        {selectedRow && (
          <p>
            Training is completed. Are you sure you want to mark the document{" "}
            <strong>{selectedRow.document_title}</strong> as effective?
          </p>
        )}
      </DialogContent>
      <DialogActions>
        <MDButton onClick={handleCloseDialog} color="error">
          Cancel
        </MDButton>
        <MDButton onClick={handleConfirmEffective} color="primary">
          Confirm
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

// PropTypes validation
EffectiveDialog.propTypes = {
  openDialog: PropTypes.bool.isRequired,  // openDialog should be a boolean
  selectedRow: PropTypes.shape({          // selectedRow should be an object with specific properties
    document_title: PropTypes.string.isRequired,
    // Add other properties of selectedRow if needed
  }).isRequired,
  handleCloseDialog: PropTypes.func.isRequired,  // handleCloseDialog should be a function
  handleConfirmEffective: PropTypes.func.isRequired,  // handleConfirmEffective should be a function
};

export default EffectiveDialog;
