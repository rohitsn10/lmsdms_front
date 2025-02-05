import React from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const ObsoleteDialog = ({ open, onClose, onConfirm, documentTitle, documentId }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Obsolete Document</DialogTitle>
      <DialogContent>Are you sure you want to obsolete &quot;{documentTitle}&quot;?</DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onConfirm(documentId)} color="secondary">
          Obsolete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// PropTypes for ObsoleteDialog
ObsoleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  documentTitle: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
};

export default ObsoleteDialog;
