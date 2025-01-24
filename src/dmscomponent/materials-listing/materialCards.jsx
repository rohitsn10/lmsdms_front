import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  CardContent,
  Collapse,
  Paper,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import apiService from "services/apiService";

const CollapsibleSection = ({
  open,
  materials,
  handleViewFileClick,
  handleOpenEditMaterialModal,
  sectionID
}) => {
    const [materialItems,setMaterialItems]=useState([]);
    useEffect(()=>{
    const fetchMaterialSection = async (trainingId) => {
        try {
            const response = await apiService.get(`/lms_module/training_section_wise_training_material`, {
                params: {
                    section_id: sectionID,
                },
            });
            console.log('Material Data:', response?.data);
            // setSectionData(response?.data);
            setMaterialItems(response?.data?.data?.materials)
        } catch (error) {
            console.error('Error fetching Material Data:', error);
        }
    };
    fetchMaterialSection();
    },[])
    console.log(materialItems)
    // console.log("Section Id:",sectionID);
    return(
  <Collapse in={open} timeout="auto" unmountOnExit>
    <CardContent sx={{ borderTop: "1px solid #ddd" }}>
      <Typography variant="subtitle1" gutterBottom>
        Materials
      </Typography>
      {Array.isArray(materialItems) && materialItems.length > 0 ? (
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
  </Collapse>
)};

CollapsibleSection.propTypes = {
  open: PropTypes.bool.isRequired,
  materials: PropTypes.arrayOf(
    PropTypes.shape({
      material_title: PropTypes.string.isRequired,
      material_type: PropTypes.string.isRequired,
      minimum_reading_time: PropTypes.string.isRequired,
      material_created_at: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleViewFileClick: PropTypes.func.isRequired,
  handleOpenEditMaterialModal: PropTypes.func.isRequired,
  sectionID:PropTypes.number.isRequired
};

export default CollapsibleSection;
