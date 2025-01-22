  import React, { useRef, useState } from 'react'
  import { Box, Grid, MenuItem, TextField, Typography } from '@mui/material';
  import Divider from '@mui/material/Divider';
  import Card from "@mui/material/Card";
  import MDButton from "components/MDButton";
  import MDTypography from 'components/MDTypography'; 
  import AddSectionModal from './AddSectionModal';
  import AddMaterialModal from './AddMaterialModal';
import CollapsibleTable from './collapsableContent.jsx';
import { useAuth } from "hooks/use-auth";
import { data } from './constant';

  function MaterialListing() {
      const [open, setOpen] = useState(false);
      const [materialType, setMaterialType] = useState("");
      const materialNameRef = useRef(null);
      const minReadingTimeRef = useRef(null);
      const fileRef = useRef(null);
      const sectionNameRef = useRef(null);
      const descriptionRef = useRef(null);
      const [status, setStatus] = useState("");
      const [openSectionModal, setOpenSectionModal] = useState(false);
      
    const { user, role } = useAuth();
  // console.log(user)
      const handleFileChange = (e) => {
        setUploadedFile(e.target.files[0]);
      };

      const handleClickOpen = () => {
          setOpen(true);
        };
        const handleClose = () => {
          setOpen(false);
        };

        const handleOpenSectionModal = () => {
          setOpenSectionModal(true);
        };
        
        const handleCloseSectionModal = () => {
          setOpenSectionModal(false);
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
      ]

        const handleSubmit=()=>{

        }
    return (
      <div>
        <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 4 }}>
          <Box sx={{
                      borderRadius: '4px',
                      padding: 2,
          }}>
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
                  <MDButton variant="contained" color="primary" onClick={handleOpenSectionModal} sx={{ ml: 1 }}>
                      + Add Section
                  </MDButton>
                  <MDButton variant="contained" color="secondary" onClick={()=>{}} sx={{ ml: 1 }}>
                      Publish
                  </MDButton>
              </Box>
              </div>
          </Box>
        {/* <CollapsibleTable/> */}
        <CollapsibleTable open={open} setOpen={setOpen} data={data}/>
        </Card>
            <AddMaterialModal 
            open={open}
            setOpen={setOpen}
            handleClose={handleClose}
            materialNameRef={materialNameRef}
            minReadingTimeRef={minReadingTimeRef}
            fileRef={fileRef}
            materialType={materialType}
            setMaterialType={setMaterialType}
            handleSubmit={handleSubmit}
            />
            <AddSectionModal
            open={openSectionModal}
            handleClose={handleCloseSectionModal}
            sectionNameRef={sectionNameRef}
            descriptionRef={descriptionRef}
            status={status}
            setStatus={setStatus}
            handleSubmit={() => {
              console.log("Section Name:", sectionNameRef.current.value);
              console.log("Description:", descriptionRef.current.value);
              console.log("Status:", status);
              handleCloseSectionModal();
            }}
          />
      </div>
    )
  }

  export default MaterialListing