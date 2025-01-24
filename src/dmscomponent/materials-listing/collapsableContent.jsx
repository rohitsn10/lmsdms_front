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
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit,
  Delete,
  Add,
  Visibility,
} from "@mui/icons-material";
import EditSectionModal from "./editSectionModal";
import EditMaterialModal from "./editMaterialModal";
import ViewFileModal from "./ViewFileModal";
import CollapsibleSection from "./materialCards";

const CollapsibleCard = ({ data, open, setOpen }) => {
  const [openRows, setOpenRows] = useState({}); // To track which rows are open
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editSectionData, setEditSectionData] = useState(null);
  const [openEditMaterialModal, setOpenEditMaterialModal] = useState(false);
  const [editMaterialData, setEditMaterialData] = useState(null);
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
    setOpenEditModal(false);
  };

  const handleEditMaterialSubmit = (updatedMaterial) => {
    console.log("Updated Material:", updatedMaterial);
    setOpenEditMaterialModal(false);
  };

  const handleViewFileClick = (material) => {
    setSelectedMaterial(material); // Set selected material
    setOpenViewFileModal(true); // Open the ViewFileModal
  };
  // console.log("Data",data)
  return (
    <Box sx={{ padding: 5 }}>

      <Grid container spacing={3}>
    {/* Check if data is an array and has items */}
    {Array.isArray(data) && data.length > 0 ? (
      data.map((row) => (
        <Grid item xs={12} key={row.id}>
          <Card
            sx={{
              boxShadow: 8,
              borderRadius: 2,
              background: "linear-gradient(to right, #f9f9f9, #e8e8e8)",
              paddingTop: 3,
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
            elevation={10}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
                    Section: {row.section_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "gray", fontSize: 14 }}
                  >
                    {row.section_description}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    startIcon={<Edit />}
                    sx={{ marginLeft: 1, color: "#1976d2" }}
                    onClick={() => handleOpenEditModal(row)}
                  >
                    Edit Section
                  </Button>
                  <Button
                    startIcon={<Delete />}
                    sx={{
                      marginLeft: 1,
                      color: "#d32f2f",
                      "&:hover": {
                        color: "red !important",
                      },
                    }}
                  >
                    Delete Section
                  </Button>
                </Box>
                <IconButton onClick={() => toggleRow(row.id)}>
                  {openRows[row.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </Box>
            </CardContent>
            <CollapsibleSection
                  open={openRows[row.id]}
                  materials={row.material}
                  handleViewFileClick={handleViewFileClick}
                  handleOpenEditMaterialModal={handleOpenEditMaterialModal}
                  sectionID={row.id}
                />
          </Card>
        </Grid>
      ))
    ) : (
      <Typography variant="h6" color="error" sx={{ textAlign: 'center', width: '100%' }}>
        Section not found.
      </Typography>
    )}
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
        />
      )}

      {editMaterialData && (
        <EditMaterialModal
          open={openEditMaterialModal}
          handleClose={handleCloseEditMaterialModal}
          materialData={editMaterialData}
          handleSubmit={handleEditMaterialSubmit}
        />
      )}
      {/* <AddMaterialModal
        open={openAddMaterialModal}
        handleClose={handleCloseAddMaterialModal}
        sectionId={currentSectionId}
        handleSubmit={handleAddMaterialSubmit}
      /> */}
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
      // material: PropTypes.arrayOf(
      //   PropTypes.shape({
      //     material_title: PropTypes.string.isRequired,
      //     material_type: PropTypes.string.isRequired,
      //     material_file_url: PropTypes.string.isRequired,
      //     minimum_reading_time: PropTypes.string.isRequired,
      //     material_created_at: PropTypes.string.isRequired,
      //   })
      // ).isRequired,
    })
  ).isRequired,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default CollapsibleCard;
