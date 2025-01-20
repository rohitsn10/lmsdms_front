import React, { useRef, useState } from 'react'
import { Box, Grid, MenuItem, TextField, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import MDBox from 'components/MDBox';
import Card from "@mui/material/Card";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from 'components/MDTypography';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AddSectionModal from './AddSectionModal';


function MaterialListing() {
    const [open, setOpen] = useState(false);
    const [materialType, setMaterialType] = useState("");
    const materialNameRef = useRef(null);
    const minReadingTimeRef = useRef(null);
    const fileRef = useRef(null);

    const handleFileChange = (e) => {
      setUploadedFile(e.target.files[0]);
    };

    const handleClickOpen = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };
    const dummyRows=[
      {
        id: 1,
        serial_number: "Section 1",
        min_time: "10 mins",
        plant_name: "Yes",
        training_name: "Safety update",
      },
      {
        id: 2,
        serial_number: "Section 2",
        min_time: "15 mins",
        plant_name: "No",
        training_name: "Procedure change",
      },
      {
        id: 3,
        serial_number: "Section 3",
        min_time: "8 mins",
        plant_name: "Yes",
        training_name: "New equipment training",
      },
    ]
    const columns = [
        { field: "serial_number", headerName: "Section", flex: 1, headerAlign: "center",disableColumnMenu:true },
        { field: "min_time", headerName: "Min Reading Time", flex: 1, headerAlign: "center",disableColumnMenu:true },
        { field: "plant_name", headerName: "Mandatory", flex: 0.5, headerAlign: "center",
            disableColumnMenu:true,
        },
        { field: "training_name", headerName: "Reason for change", flex: 1, headerAlign: "center",disableColumnMenu:true, 
         },
        {
            field: "add_file",
            headerName: "File",
            flex: 1,
            headerAlign: "center",
            sortable: false,
            disableColumnMenu:true,
            renderCell: (params) => (
              <button
                onClick={() => handleAddFile(params.row)}
                style={{ padding: "5px 10px",cursor:"pointer", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px" }}
              >
                Add File
              </button>
            ),
          },
          {
            field: "actions",
            headerName: "Actions",
            flex: 1.2,
            headerAlign: "center",
            sortable: false,
            disableColumnMenu:true,
            renderCell: (params) => (
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleEdit(params.row)}
                  style={{ padding: "9px 14px", backgroundColor: "#FFC107", color: "#000", border: "none", borderRadius: "4px",cursor:'pointer' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(params.row)}
                  style={{ padding: "9px 14px", backgroundColor: "#DC3545", color: "#fff", border: "none", borderRadius: "4px",cursor:'pointer' }}
                >
                  Delete
                </button>
              </div>
            ),
          },
      ];
      const handleDelete=()=>{

      }
      const handleEdit=()=>{
        
      }
      const handleAddFile=()=>{

      }
      const handleSubmit=()=>{

      }
  return (
    <div>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 4 }}>
        <Box sx={{
                    borderRadius: '4px',
                    padding: 2,
        }}>
            {/* <Typography variant="h6" sx={{ marginBottom: 1 }}>
                Training Detail
            </Typography> */}
            <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center" }}>
                Manage Sections
            </MDTypography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={1} sx={{
                mr:2,
                ml:2
            }}>
                <Grid item xs={2}>
                    <MDTypography variant="h5" color="textSecondary">
                        Training No.:
                    </MDTypography>
                    <Typography variant="h5">PRD052</Typography>
                </Grid>
                <Grid item xs={2}>
                {/* <Typography variant="h5" color="textSecondary">
                    Version:
                </Typography>
                <Typography variant="h5">6.0</Typography> */}
                {/*  */}
                    <MDTypography variant="h5" color="textSecondary">
                        Version:
                    </MDTypography>
                    <Typography variant="h5">6.0</Typography>
                </Grid>
                <Grid item xs={3}>
                    <MDTypography variant="h5" color="textSecondary">
                     Reading Time:
                    </MDTypography>
                    <Typography variant="h5">--</Typography>
                {/*  */}
                </Grid>
                <Grid item xs={4}>
                    {/*  */}
                    <MDTypography variant="h5" color="textSecondary">
                    Training Title:                    
                    </MDTypography>
                    <Typography variant="h6">Capacity Calibration of Manufacturing Equipments Manufacturing Manufacturing Manufacturing
                    </Typography>
                </Grid>
            </Grid>
        </Box>
       <hr
          style={{
            width: '95%',
            margin: '20px auto',
            border: 'none',
            borderTop: '2px solid rgb(231, 179, 197)',
          }}
        />
        <Box
        sx={{
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
            px:4,
            py:2
        }}
        >
            <Typography variant="h6" fontWeight="medium">
                Section & Material List
            </Typography>   
            <div>
            <Box sx={{ display: "flex", gap: 1 }}>
                <MDButton variant="contained" color="primary" onClick={handleClickOpen} sx={{ ml: 1 }}>
                    + Add Section
                </MDButton>
                <MDButton variant="contained" color="secondary" onClick={()=>{}} sx={{ ml: 1 }}>
                    Publish
                </MDButton>
            </Box>
            </div>
        </Box>
        <DataGrid
            rows={dummyRows}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
            sx={{
                  minWidth: 1000,
                   m:2,
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  "& .MuiDataGrid-columnHeaders": {
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5",
                    fontWeight: "bold",
                  },
                  "& .MuiDataGrid-cell": {
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                }}
        />
     
      </Card>
      {/* </MDBox> */}
      {/* <Dialog
      onClose={handleClose}
      open={open}
      aria-labelledby="add-section-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="add-section-dialog-title" sx={{ m: 0, p: 2 }}>
        Add Section
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <TextField
            inputRef={materialNameRef}
            type="text"
            label="Material Name"
            fullWidth
            margin="normal"
          />
          <TextField
            inputRef={minReadingTimeRef}
            type="number"
            label="Min Reading Time (mins)"
            fullWidth
            margin="normal"
            InputProps={{ inputProps: { min: 1 } }}
          />
          <TextField
            select
            label="Material Type"
            fullWidth
            margin="normal"
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}

            InputProps={{
              sx: {
                height: 50,
                fontSize: "1rem",
              },
            }}
            SelectProps={{
                sx: {
                  padding: "10px",
                },
              }}
          >
            <MenuItem value="PDF">PDF</MenuItem>
            <MenuItem value="Video">Video</MenuItem>
            <MenuItem value="Document">Document</MenuItem>
          </TextField>

          <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
            Upload Document
          </Typography>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.mp4"
            style={{ marginTop: "8px", marginBottom: "16px", width: "100%" }}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button 
        sx={
          {
            backgroundColor:'',
            border:'1px solid gray',
            color:'black',
            "&:hover":{
              color:'black'
            }
          }
        }
         onClick={handleSubmit}>
          Add Section
        </Button>
        <Button
          onClick={handleClose}
          sx={
            {
              color:'red',
              border:'1px solid red',
              "&:hover":{
                color:'red'
              }
            }
          }
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>            */}
          <AddSectionModal 
          open={open}
          handleClose={handleClose}
          materialNameRef={materialNameRef}
          minReadingTimeRef={minReadingTimeRef}
          fileRef={fileRef}
          materialType={materialType}
          setMaterialType={setMaterialType}
          handleSubmit={handleSubmit}
          />
    </div>
  )
}

export default MaterialListing