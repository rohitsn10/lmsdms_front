import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Collapse,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import EditSectionModal from "./editSectionModal";
import EditMaterialModal from "./editMaterialModal";
import ViewFileModal from "./ViewFileModal";

const CollapsibleCard = ({ data,open,setOpen }) => {
  const [openRows, setOpenRows] = useState({}); // To track which rows are open
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editSectionData, setEditSectionData] = useState(null);

  const [openEditMaterialModal, setOpenEditMaterialModal] = useState(false);
  const [editMaterialData, setEditMaterialData] = useState(null); 
  
  // View File.
  const [openViewFileModal, setOpenViewFileModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const toggleRow = (id) => {
    setOpenRows((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleOpenEditModal = (section) => {
    setEditSectionData(section);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditSectionData(null);
  };

  const handleOpenEditMaterialModal = (material) => {
    setEditMaterialData(material); // Set the material data to be edited
    setOpenEditMaterialModal(true); // Open the material edit modal
  };

  const handleCloseEditMaterialModal = () => {
    setOpenEditMaterialModal(false); // Close the material edit modal
    setEditMaterialData(null); // Clear material data
  };
  const handleCloseViewFileModal = () => {
    setOpenViewFileModal(false);
    setSelectedMaterial(null); // Clear the selected material
  };

  const handleEditSubmit = (updatedSection) => {
    console.log("Updated Section:", updatedSection);
    // Add logic to update the section in the parent state or backend
    setOpenEditModal(false);
  };
  const handleEditMaterialSubmit = (updatedMaterial) => {
    console.log("Updated Material:", updatedMaterial);
    // Logic for updating material
    setOpenEditMaterialModal(false);
  };
  // const handleViewFileClick = (material) => {
  //   if (material.material_type === "pdf") {
  //     window.open(material.material_file_url, "_blank");
  //   } else if (material.material_type === "video") {
  //     const videoUrl = material.material_file_url;
  //     if (videoUrl) {
  //       window.open(videoUrl, "_blank");
  //     } else {
  //       console.error("Invalid video URL");
  //     }
  //   } else {
  //     console.log("Unsupported material type");
  //   }
  // };
  const handleViewFileClick = (material) => {
    setSelectedMaterial(material); // Set selected material
    setOpenViewFileModal(true); // Open the ViewFileModal
  };
  console.log("Section Data:",data)
  return (
    <Box sx={{ padding: 5 }}>
      <Grid container spacing={2}>
        {data?.map((row) => (
          <Grid item xs={12} key={row.id}>
            <Card sx={{boxShadow: 8, paddingTop: 3}} elevation={10}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                  sx={{
                    display:'flex',
                    justifyContent:'space-between'
                  }}
                  >
                  <div>
                    <Typography variant="text.primary">
                      Section: {row.section_name}
                    </Typography>
                    <Typography variant="body2" sx={{
                        color:"gray",
                        fontSize:14
                    }}>
                      Section Description:{row.section_description}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary">
                      Order: {row.section_order}
                    </Typography> */}
                  </div>
                    <div>
                        <Button onClick={()=>setOpen(!open)}>Add Material.</Button>
                        <Button
                        sx={{ marginLeft: 1 }}
                        onClick={() => handleOpenEditModal(row)}
                      >
                        Edit Section
                      </Button>
                    </div>
                  </Box>
                  <IconButton onClick={() => toggleRow(row.id)}>
                    {openRows[row.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </Box>
              </CardContent>

              <Collapse in={openRows[row.id]} timeout="auto" unmountOnExit>
                <CardContent sx={{ borderTop: "1px solid #ddd" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Materials
                  </Typography>
                  {row.material.map((material, index) => (
                    <Paper
                      key={index}
                      elevation={1}
                      sx={{
                        padding: 2,
                        marginBottom: 2,
                        border: "1px solid #ddd",
                      }}
                    >
                      <Typography variant="body1">
                        <strong>Title:</strong> {material.material_title}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Type:</strong> {material.material_type}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Reading Time:</strong> {material.minimum_reading_time}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Created At:</strong>{" "}
                        {new Date(material.material_created_at).toLocaleString()}
                      </Typography>
                      <Box sx={{display:'flex',flexDirection:'row',gap:'20px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleViewFileClick(material)}
                            // href={material.material_file_url}
                            // target="_blank"
                            size="small"
                            sx={{ marginTop: 1,
                                color:'white !important'
                            }}
                        >
                            View File
                        </Button>
                        <Button
                          onClick={() => handleOpenEditMaterialModal(material)} // Open the edit material modal
                          size="small"
                          sx={{
                            marginTop: 1,
                            color: "white !important",
                            background: "#62B866",
                            "&:hover": {
                              color: "white !important",
                              background: "#62B866",
                            },
                          }}
                        >
                          Edit Material
                        </Button>
                        {/* <Button
                            variant="contained"
                            href={material.material_file_url}
                            target="_blank"
                            size="small"
                            sx={{ marginTop: 1,
                                color:'white !important',
                                background:'#ce3333',
                                "&:hover":{
                                    color:'white !important',
                                    background:'#ce3333'
                                }
                            }}
                        >
                            Delete
                        </Button> */}
                      </Box>

                    </Paper>
                  ))}
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))} 
      </Grid>
      {selectedMaterial && (
        <ViewFileModal
          open={openViewFileModal}
          handleClose={handleCloseViewFileModal}
          material={selectedMaterial}
        />
      )}

      {editSectionData && (
        <EditSectionModal
          open={openEditModal}
          handleClose={handleCloseEditModal}
          sectionData={editSectionData}
          handleSubmit={handleEditSubmit}
        />)}
      
      {editMaterialData && (
        <EditMaterialModal
          open={openEditMaterialModal}
          handleClose={handleCloseEditMaterialModal}
          materialData={editMaterialData}
          handleSubmit={handleEditMaterialSubmit}
        />
      )}
    </Box>
  );
};

CollapsibleCard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      training: PropTypes.number.isRequired,
      training_name: PropTypes.string.isRequired,
      section_name: PropTypes.string.isRequired,
      section_description: PropTypes.string.isRequired,
      section_order: PropTypes.string.isRequired,
      material: PropTypes.arrayOf(
        PropTypes.shape({
          material_title: PropTypes.string.isRequired,
          material_type: PropTypes.string.isRequired,
          material_file_url: PropTypes.string.isRequired,
          minimum_reading_time: PropTypes.string.isRequired,
          material_created_at: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  open:PropTypes.bool,
  setOpen:PropTypes.func
};

export default CollapsibleCard;
