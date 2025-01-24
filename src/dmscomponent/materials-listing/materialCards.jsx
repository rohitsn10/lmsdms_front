import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  CardContent,
  Collapse,
  Paper,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Visibility, Edit, Delete, Add } from "@mui/icons-material";
import useSectionMaterials from "../../hooks/materialHook"; // Import the hook
import AddMaterialModal from "./createMaterialModal";

const CollapsibleSection = ({
  open,
  handleViewFileClick,
  handleOpenEditMaterialModal,
  sectionID,
}) => {
  const [openAddMaterialModal, setOpenAddMaterialModal] = useState(false);

  // Use the custom hook
  const { materialItems, fetchMaterialSection, loading, error } =
    useSectionMaterials(sectionID);

  // Remove `sectionID` dependency since it's static
  React.useEffect(() => {
    fetchMaterialSection();
  }, []); // Fetch only on mount

  const handleOpenAddMaterialModal = () => {
    setOpenAddMaterialModal(true);
  };

  const handleCloseAddMaterialModal = () => {
    setOpenAddMaterialModal(false);
  };

  const handleAddMaterialSubmit = async (newMaterial) => {
    try {
      await apiService.post(`/lms_module/add_training_material`, {
        section_id: sectionID,
        ...newMaterial,
      });

      // Refetch materials after successfully adding
      await fetchMaterialSection();

      console.log("New Material Added:", newMaterial);
    } catch (err) {
      console.error("Error adding material:", err);
    }
    handleCloseAddMaterialModal();
  };

  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <CardContent sx={{ borderTop: "1px solid #ddd" }}>
        <Typography variant="subtitle1" gutterBottom>
          Materials
          <Button
            startIcon={<Add />}
            onClick={handleOpenAddMaterialModal}
            sx={{
              color: "green",
              "&:hover": {
                background: "#43a047",
                color: "white !important",
              },
            }}
          >
            Add Material
          </Button>
        </Typography>

        {loading ? (
          <Typography variant="body2" color="textSecondary">
            Loading materials...
          </Typography>
        ) : error ? (
          <Typography variant="body2" color="error">
            Error fetching materials.
          </Typography>
        ) : Array.isArray(materialItems) && materialItems.length > 0 ? (
          materialItems.map((material, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{
                padding: 2,
                marginBottom: 2,
                border: "1px solid #ddd",
                borderRadius: 1,
                "&:hover": {
                  boxShadow: 4,
                },
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
              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                <Button
                  variant="contained"
                  startIcon={<Visibility />}
                  color="primary"
                  onClick={() => handleViewFileClick(material)}
                  size="small"
                  sx={{
                    marginTop: 1,
                    textTransform: "none",
                  }}
                >
                  View File
                </Button>
                <Button
                  startIcon={<Edit />}
                  onClick={() => handleOpenEditMaterialModal(material)}
                  size="small"
                  sx={{
                    marginTop: 1,
                    color: "white !important",
                    background: "#62B866",
                    "&:hover": {
                      color: "white !important",
                      background: "#4caf50",
                    },
                  }}
                >
                  Edit Material
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Delete />}
                  size="small"
                  sx={{
                    marginTop: 1,
                    color: "white !important",
                    background: "#d32f2f",
                    "&:hover": {
                      color: "white !important",
                      background: "#c62828",
                    },
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No materials available.
          </Typography>
        )}
      </CardContent>
      <AddMaterialModal
        open={openAddMaterialModal}
        handleClose={handleCloseAddMaterialModal}
        sectionId={sectionID}
        handleSubmit={handleAddMaterialSubmit}
      />
    </Collapse>
  );
};

CollapsibleSection.propTypes = {
  open: PropTypes.bool.isRequired,
  handleViewFileClick: PropTypes.func.isRequired,
  handleOpenEditMaterialModal: PropTypes.func.isRequired,
  sectionID: PropTypes.number.isRequired,
};

export default CollapsibleSection;
