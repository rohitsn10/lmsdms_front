import React, { useState, useEffect } from "react";
import {
  Card,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Button as MDButton,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTrainingListQuery } from "apilms/trainigMappingApi"; // Import the hook
import { useGetPlantQuery } from "apilms/plantApi";
import { useGetAreaQuery } from "apilms/AreaApi";
import { useFetchDepartmentsQuery } from "api/auth/departmentApi";
import { useJobTrainingListQuery } from "apilms/trainigMappingApi"; // Import the new hook
import { useJobroleAssignTrainingMutation } from "apilms/trainigMappingApi";

const TrainingMapping = () => {
  const initialData = {
    toDo: [], // Start with an empty array for the toDo column
    inProgress: [],
  };

  const [selectedTraining, setSelectedTraining] = useState(""); // State for selected training
  const [selectedPlant, setSelectedPlant] = useState(""); // State for selected plant
  const [selectedArea, setSelectedArea] = useState(""); // State for selected area
  const [selectedDepartment, setSelectedDepartment] = useState(""); // State for selected department
  const [kanbanData, setKanbanData] = useState(initialData);

  // API calls
  const { data: plantData } = useGetPlantQuery();
  const { data: areaData, isLoading: areaLoading, error: areaError } = useGetAreaQuery();
  const { data: trainingData, error, isLoading } = useTrainingListQuery();
  const { data: departmentData, isLoading: isDepartmentsLoading } = useFetchDepartmentsQuery();

  // Conditionally call the job training API only if a training is selected
  const { data: jobRoleData, isLoading: jobRoleLoading, error: jobRoleError } = useJobTrainingListQuery(
    {
      plantId: selectedPlant,
      departmentId: selectedDepartment,
      areaId: selectedArea,
      trainingId: selectedTraining, // Only pass trainingId when selectedTraining is not empty
    },
    { skip: !selectedTraining } // Skip the query if no training is selected
  );
  const [jobroleAssignTraining] = useJobroleAssignTrainingMutation();
  // Handle the Drag and Drop
  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    if (sourceColumn === destColumn && source.index === destination.index) {
      return;
    }

    const sourceItems = Array.from(kanbanData[sourceColumn]);
    const [removed] = sourceItems.splice(source.index, 1);
    const destinationItems = Array.from(kanbanData[destColumn]);
    destinationItems.splice(destination.index, 0, removed);

    setKanbanData({
      ...kanbanData,
      [sourceColumn]: sourceItems,
      [destColumn]: destinationItems,
    });
  };

  const handleMapping = async () => {
    // Prepare the job role IDs from the "Assigned Role" column (inProgress)
    const assignedJobRoles = kanbanData.inProgress.map((item) => item.id);

    // If no job roles are assigned, show an error message
    if (assignedJobRoles.length === 0) {
      alert("Please assign job roles before mapping.");
      return;
    }

    // Call the mutation with the selected training ID and the assigned job role IDs
    try {
      const response = await jobroleAssignTraining({
        training_id: selectedTraining,
        job_role_ids: assignedJobRoles,
      }).unwrap(); // Unwrap the response to handle it directly
      console.log("Mapping success:", response);
      // Optionally, show a success message or handle additional UI updates
    } catch (error) {
      console.error("Mapping error:", error);
    }
  };


  useEffect(() => {
    if (jobRoleData && jobRoleData.job_roles) {
      const jobRoles = jobRoleData.job_roles.map((job) => ({
        id: job.id.toString(),
        title: job.job_role_name,
        description: job.job_role_description,
      }));

      setKanbanData({
        ...kanbanData,
        toDo: jobRoles, // Add the fetched job roles to the 'toDo' column
      });
    }
  }, [jobRoleData]); // Update Kanban data whenever jobRoleData changes

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center" justifyContent="center">
          {/* Training Dropdown */}
          <FormControl fullWidth margin="dense" sx={{ width: "250px", ml: 5 }}>
            <InputLabel id="select-training-label">Training</InputLabel>
            <Select
              labelId="select-training-label"
              id="select-training"
              value={selectedTraining}
              onChange={(e) => setSelectedTraining(e.target.value)}
              input={<OutlinedInput label="Training" />}
              sx={{
                minWidth: 150,
                height: "2.4rem",
                ".MuiSelect-select": { padding: "0.45rem" },
              }}
            >
              {/* Loading state for the dropdown */}
              {isLoading ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : error ? (
                <MenuItem disabled>Error loading trainings</MenuItem>
              ) : Array.isArray(trainingData) && trainingData.length > 0 ? (
                trainingData.map((training) => (
                  <MenuItem key={training.id} value={training.id}>
                    {training.training_name_with_number}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No trainings available</MenuItem>
              )}
            </Select>
          </FormControl>

          {/* Title */}
          <MDTypography variant="h3" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center", mr: 20 }}>
            Training Mapping
          </MDTypography>

          {/* Mapping Button */}
          <MDButton
            variant="contained"
            sx={{
              ml: 2,
              backgroundColor: "#e91e63",
              color: "#fff",
              "&:hover": { backgroundColor: "#e2185b" },
            }}
            onClick={handleMapping}
          >
            Mapping
          </MDButton>
        </MDBox>

        {/* Conditional Rendering for Additional Dropdowns */}
        {selectedTraining && (
          <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center" sx={{ flexWrap: "wrap" }}>
            {/* Plant Dropdown */}
            <FormControl fullWidth margin="dense" sx={{ width: "20%", mb: 2, ml: 5 }}>
              <InputLabel id="select-plant-label">Plant Name</InputLabel>
              <Select
                labelId="select-plant-label"
                id="select-plant"
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                input={<OutlinedInput label="Plant Name" />}
                sx={{
                  minWidth: 200,
                  height: "3rem",
                  ".MuiSelect-select": { padding: "0.45rem" },
                }}
                displayEmpty
              >
                {plantData?.data?.map((plant) => (
                  <MenuItem key={plant.id} value={plant.id}>
                    {plant.plant_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Area Dropdown */}
            <FormControl fullWidth margin="dense" sx={{ width: "20%", mb: 2 }}>
              <InputLabel id="select-area-label">Select Area</InputLabel>
              <Select
                labelId="select-area-label"
                id="select-area"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                input={<OutlinedInput label="Select Area" />}
                sx={{
                  minWidth: 200,
                  height: "3rem",
                  ".MuiSelect-select": { padding: "0.45rem" },
                }}
                displayEmpty
              >
                {areaLoading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : areaError ? (
                  <MenuItem disabled>Error loading areas</MenuItem>
                ) : areaData?.data?.length > 0 ? (
                  areaData.data.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.area_name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No areas available</MenuItem>
                )}
              </Select>
            </FormControl>

            {/* Department Dropdown */}
            <FormControl sx={{ minWidth: 180, mr: 2 }}>
              <InputLabel>Department</InputLabel>
              <Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                label="Department"
                sx={{
                  minWidth: 200,
                  height: "2.5rem",
                  ".MuiSelect-select": { padding: "0.45rem" },
                }}
              >
                {departmentData?.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.department_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </MDBox>
        )}

        {/* Drag and Drop Context */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <MDBox display="flex" justifyContent="center" alignItems="center">
            {/* To Do Column */}
            <Droppable droppableId="toDo">
              {(provided) => (
                <Card
                  sx={{
                    width: "43%",
                    ml: 5,
                    p: 2,
                    mb: 2,
                    borderRadius: 5,
                    boxShadow: 5,
                  }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <MDTypography variant="h4" sx={{ textAlign: "center" }}>
                    Job Role
                  </MDTypography>
                  <Box>
                    {kanbanData.toDo.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <Card
                            sx={{ marginBottom: 2, padding: 2, boxShadow: 1 }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <MDTypography variant="body1">{item.title}</MDTypography>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                </Card>
              )}
            </Droppable>
            <IconButton sx={{ mx: 2, fontSize: "6rem" }}>
              <ArrowForwardIcon sx={{ fontSize: "inherit" }} />
            </IconButton>
            {/* In Progress Column */}
            <Droppable droppableId="inProgress">
              {(provided) => (
                <Card
                  sx={{
                    width: "43%",
                    p: 2,
                    mb: 2,
                    borderRadius: 5,
                    boxShadow: 5,
                  }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <MDTypography variant="h4" sx={{ textAlign: "center" }}>
                    Assigned Role
                  </MDTypography>
                  <Box>
                    {kanbanData.inProgress.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <Card
                            sx={{ marginBottom: 2, padding: 2, boxShadow: 1 }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <MDTypography variant="body1">{item.title}</MDTypography>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                </Card>
              )}
            </Droppable>
          </MDBox>
        </DragDropContext>
      </Card>
    </MDBox>
  );
};

export default TrainingMapping;
