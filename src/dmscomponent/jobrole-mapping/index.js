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
import { useGetPlantQuery } from "apilms/plantApi";
import { useGetAreaQuery } from "apilms/AreaApi";
import { useFetchDepartmentsQuery } from "api/auth/departmentApi";
import { useGetJobRoleQuery } from "apilms/jobRoleApi";
import { useFetchTrainingTypesQuery } from "apilms/trainingtypeApi";
import { useTrainingListDataQuery } from "apilms/trainigMappingApi";
import { useJobTrainingListMappingQuery } from "apilms/trainigMappingApi"; 

const JobRoleMapping = () => {
  
  const [selectedJobRole, setSelectedJobRole] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [kanbanData, setKanbanData] = useState({
    toDo: [],
    inProgress: [],
  });
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [errors, setErrors] = useState({});
  const { data: jobRoleData } = useGetJobRoleQuery();
  const { data: trainingTypesData } = useFetchTrainingTypesQuery({
    enabled: !!trainingType, 
  });

  const {
    data: trainingListData,
    isLoading: trainingLoading,
    error: trainingError,
  } = useTrainingListDataQuery({ training_type: trainingType });
  const { data: jobTrainingListData, refetch,isLoading: jobTrainingLoading } = useJobTrainingListMappingQuery({
    job_role_id: selectedJobRole, 
  
  });
  useEffect(() => {
    refetch()
    console.log('Selected Job Role:', selectedJobRole);
    console.log('Triggering Job Training API with:', selectedJobRole);
    console.log("------------------------------*---------------",jobTrainingListData);
  }, [selectedJobRole]);
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

  useEffect(() => {
    if (trainingListData?.length > 0) {
      const updatedToDoList = trainingListData.map((training) => ({
        id: training.training_number,
        title: training.training_name,
        description: `Training No: ${training.training_version}`,
      }));
      setKanbanData((prevData) => ({
        ...prevData,
        toDo: updatedToDoList,
      }));
    }
  }, [trainingListData]);
  useEffect(() => {
    if (jobTrainingListData?.data?.length > 0) {
      const updatedInProgressList = jobTrainingListData.data.map((training) => ({
        id: training.training_number,
        title: training.training_name,
        description: `Training No: ${training.training_number}`,
      }));
      setKanbanData((prevData) => ({
        ...prevData,
        inProgress: updatedInProgressList,
      }));
    }
  }, [jobTrainingListData]);

  const handleMapping = () => {
    console.log("Mapping button clicked with selected status:", selectedStatus);
  };

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center" justifyContent="center">
          <MDBox mb={3}>
            <FormControl sx={{ width: "250px", ml: 5 }}>
              <InputLabel id="select-training-type-label">Training Type</InputLabel>
              <Select
                labelId="select-training-type-label"
                id="select-training-type"
                value={trainingType}
                onChange={(e) => setTrainingType(e.target.value)}
                input={<OutlinedInput label="Training Type" />}
                sx={{
                  minWidth: 200,
                  height: "3rem",
                  ".MuiSelect-select": { padding: "0.45rem" },
                }}
                error={!!errors.trainingType}
              >
                {trainingTypesData?.data?.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.training_type_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.trainingType && (
                <p style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
                  {errors.trainingType}
                </p>
              )}
            </FormControl>
          </MDBox>

          <MDTypography variant="h3" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center", mr: 20 }}>
            Job Role Mapping
          </MDTypography>

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
        <MDBox ml="10px" display="flex" justifyContent="space-between" alignItems="center" sx={{ flexWrap: "wrap" }}>
          <FormControl sx={{ minWidth: 200, mb: 2, ml: 5 }}>
            <InputLabel>Job Role</InputLabel>
            <Select
              value={selectedJobRole}
              onChange={(e) => setSelectedJobRole(e.target.value)}
              label="Job Role"
              sx={{
                minWidth: 200,
                height: "2.5rem",
                ".MuiSelect-select": { padding: "0.45rem" },
              }}
            >
              {jobRoleData?.data?.length > 0 ? (
                jobRoleData.data.map((jobRole) => (
                  <MenuItem key={jobRole.id} value={jobRole.id}>
                    {jobRole.job_role_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Job Roles Available</MenuItem>
              )}
            </Select>
          </FormControl>
        </MDBox>
        <DragDropContext onDragEnd={handleDragEnd}>
          <MDBox display="flex" justifyContent="center" alignItems="center">
            <Droppable droppableId="toDo">
              {(provided) => (
                <Card sx={{ width: "43%", ml: 5, p: 2, mb: 2, borderRadius: 5, boxShadow: 5 }} ref={provided.innerRef} {...provided.droppableProps}>
                  <MDTypography variant="h4" sx={{ textAlign: "center" }}>
                    Available Training
                  </MDTypography>
                  <Box>
                    {kanbanData.toDo.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <Card sx={{ marginBottom: 2, padding: 2, boxShadow: 1 }} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <MDTypography variant="body1">{item.title}</MDTypography>
                            <MDTypography variant="body2" color="textSecondary">
                              {item.description}
                            </MDTypography>
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
            <Droppable droppableId="inProgress">
              {(provided) => (
                <Card sx={{ width: "43%", mr: 5, p: 2, mb: 2, borderRadius: 5, boxShadow: 5 }} ref={provided.innerRef} {...provided.droppableProps}>
                  <MDTypography variant="h4" sx={{ textAlign: "center" }}>
                    Assigned Training
                  </MDTypography>
                  <Box>
                    {kanbanData.inProgress.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <Card sx={{ marginBottom: 2, padding: 2, boxShadow: 1 }} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <MDTypography variant="body1">{item.title}</MDTypography>
                            <MDTypography variant="body2" color="textSecondary">
                              {item.description}
                            </MDTypography>
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
export default JobRoleMapping;
