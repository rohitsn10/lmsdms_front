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
import { useFetchTrainingsQuery } from "apilms/trainingApi";
import { useGetJobRoleQuery } from "apilms/jobRoleApi";
import { useTrainingAssignJobroleQuery } from "apilms/MappingApi";
import { useTrainingAssignJobroleMutationMutation } from "apilms/MappingApi";
import { toast } from "react-toastify";

const JobRoleMapping = () => {
  const [selectedJobRole, setSelectedJobRole] = useState("");
  const [kanbanData, setKanbanData] = useState({
    toDo: [],
    inProgress: [],
  });

  const { data: trainingData, error: trainingError, isLoading: trainingIsLoading } = useFetchTrainingsQuery();
  const { data: jobRoleData, error: jobRoleError, isLoading: jobRoleIsLoading } = useGetJobRoleQuery();

  const { data: assignedTraining, error: assignedTrainingError, isLoading: assignedTrainingIsLoading } = useTrainingAssignJobroleQuery(selectedJobRole, { skip: !selectedJobRole });
  const [trainingAssignJobrole, { isLoading: isMappingLoading, error: mappingError }] = useTrainingAssignJobroleMutationMutation();
  useEffect(() => {
    if (trainingData) {
      const sampleToDo = trainingData.document_data.map((doc) => ({
        id: doc.id.toString(),
        title: doc.document_title,
        description: doc.document_description,
      }));
      setKanbanData({
        toDo: sampleToDo,
        inProgress: [],
      });
    }

    if (assignedTraining && Array.isArray(assignedTraining.data)) {
      const assignedItems = assignedTraining.data.map((training) => ({
        id: training.id.toString(),
        title: training.training_title,
        description: training.training_description,
      }));
      setKanbanData((prev) => ({
        ...prev,
        inProgress: assignedItems, // Set the assigned training in the "Assigned Training" section
      }));
    }
  }, [trainingData, assignedTraining]);

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
    // Get document ids from the "inProgress" column
    const documentIds = kanbanData.inProgress.map((item) => parseInt(item.id)); // Convert to numbers as expected in API

    try {
      await trainingAssignJobrole({
        job_role_id: selectedJobRole,
        document_ids: documentIds,
      });
      toast.success("Training successfully assigned!"); // Success toast
      console.log("Training successfully assigned");
    } catch (err) {
      toast.error("Error assigning training: " + err.message); // Error toast
      console.error("Error assigning training:", err);
    }
  };

  if (trainingIsLoading || jobRoleIsLoading || assignedTrainingIsLoading) {
    return <div>Loading...</div>;
  }

  if (trainingError || jobRoleError || assignedTrainingError) {
    return <div>Error fetching data</div>;
  }

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center" justifyContent="center">
          <MDBox mb={3}>
            <FormControl sx={{ width: "250px", ml: 5 }}>
              <InputLabel id="select-job-role-label">Job Role</InputLabel>
              <Select
                labelId="select-job-role-label"
                id="select-job-role"
                value={selectedJobRole}
                onChange={(e) => setSelectedJobRole(e.target.value)}
                input={<OutlinedInput label="Job Role" />}
                sx={{
                  minWidth: 200,
                  height: "3rem",
                  ".MuiSelect-select": { padding: "0.45rem" },
                }}
              >
                {jobRoleData?.data?.map((job) => (
                  <MenuItem key={job.id} value={job.id}>
                    <Box>
                      <MDTypography variant="body1" sx={{ fontWeight: "bold" }}>
                        {job.job_role_name}
                      </MDTypography>
                      <MDTypography variant="body2" color="textSecondary">
                        {job.job_role_description}
                      </MDTypography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
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
