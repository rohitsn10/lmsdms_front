// ESignatureDialog.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSubmitESignatureMutation } from 'api/auth/esignatureApi'; // Import the new mutation hook

const ESignatureDialog = ({ open, handleClose }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null); // State to handle error messages

  const [submitESignature, { isLoading }] = useSubmitESignatureMutation(); // Destructure the mutation

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    try {
      setError(null); // Reset any previous error
      const response = await submitESignature(password).unwrap(); // Use unwrap to get the response
      if (response.status) {
        console.log(response.message); // Handle success (e.g., show a success message)
        handleClose(); // Close the dialog after successful submission
      } else {
        setError("Submission failed, please try again."); // Handle error response
      }
    } catch (error) {
      setError("An error occurred while submitting the signature."); // Set error message on catch
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" sx={{ zIndex: 1300 }}>
      <DialogTitle sx={{ textAlign: 'center' }}>E-Signature</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="Enter Password"
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
            sx: { paddingRight: '8px' }
          }}
          sx={{
            marginBottom: 2,
            '& .MuiInputBase-input': {
              padding: '12px',
            },
          }}
        />
        {error && <Typography color="error" variant="body2">{error}</Typography>} {/* Error message display */}
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
          disabled={isLoading} // Disable button while loading
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
