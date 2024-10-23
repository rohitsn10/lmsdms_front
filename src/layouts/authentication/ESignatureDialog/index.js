// ESignatureDialog.js
import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ESignatureDialog = ({ open, handleClose }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = () => {
    console.log("E-Signature submitted with password:", password);
    handleClose(); // Close the dialog after submission
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" sx={{ zIndex: 1300 }}>
      <DialogTitle sx={{ textAlign: 'center' }}>E-Signature</DialogTitle>
      <DialogContent>
        <TextField
          label="Enter Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          variant="outlined"
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleToggleShowPassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
          sx={{ marginBottom: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Typography 
          variant="body2" 
          onClick={handleClose} 
          sx={{ cursor: 'pointer', color: 'black', marginRight: 2 }}
        >
          Cancel
        </Typography>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          sx={{ 
            backgroundColor: '#3f51b5', 
            color: '#fff', 
            '&:hover': { 
              backgroundColor: '#303f9f' 
            } 
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Add prop types validation
ESignatureDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ESignatureDialog;
