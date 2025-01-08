import React, { useState } from "react";
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
import { useTrainingListQuery } from "apilms/trainigMappingApi";

const JobRoleMapping = () => {
  const initialData = {
    toDo: [
      { id: "1", title: "Job Role 1", description: "Description for job role 1" },
      { id: "2", title: "Job Role 2", description: "Description for job role 2" },
      { id: "3", title: "Job Role 3", description: "Description for job role 3" },
    ],
    inProgress: [
      { id: "7", title: "Job Role 4", description: "Description for job role 4" },
      { id: "8", title: "Job Role 5", description: "Description for job role 5" },
    ],
  };

  const statusOptions = [
    { id: "all", status: "All" },
    { id: "1", status: "Active" },
    { id: "2", status: "Inactive" },
    { id: "3", status: "Pending" },
  ];

  const [kanbanData, setKanbanData] = useState(initialData);
  const [selectedStatus, setSelectedStatus] = useState("all");

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

  const handleMapping = () => {
    console.log("Mapping button clicked with selected status:", selectedStatus);
  };

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center" justifyContent="center">
          {/* Status Dropdown */}
          <FormControl fullWidth margin="dense" sx={{ width: "250px", ml: 5 }}>
            <InputLabel id="select-status-label">Job Role</InputLabel>
            <Select
              labelId="select-status-label"
              id="select-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              input={<OutlinedInput label="Job Role" />}
              sx={{
                minWidth: 150,
                height: "2.4rem",
                ".MuiSelect-select": { padding: "0.45rem" },
              }}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Title */}
          <MDTypography
            variant="h3"
            fontWeight="medium"
            sx={{ flexGrow: 1, textAlign: "center", mr: 20 }}
          >
            Job Role Mapping
          </MDTypography>

          {/* Mapping Button */}
          <MDButton
            variant="contained"
            sx={{ ml: 2, backgroundColor: "#e91e63", color: "#fff", "&:hover": { backgroundColor: "#e2185b" } }}
            onClick={handleMapping}
          >
            Mapping
          </MDButton>
        </MDBox>

        {/* Drag and Drop Context */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <MDBox display="flex" justifyContent="center" alignItems="center">
            {/* To Do Column */}
            <Droppable droppableId="toDo">
              {(provided) => (
                <Card
                  sx={{ width: "43%", ml: 5, p: 2, mb: 2, borderRadius: 5, boxShadow: 5 }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <MDTypography variant="h4" sx={{ textAlign: "center" }}>
                    Available Job Roles
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

            {/* Arrow Icon Between Cards */}
            <IconButton sx={{ mx: 2, fontSize: "6rem" }}>
              <ArrowForwardIcon sx={{ fontSize: "inherit" }} />
            </IconButton>

            {/* In Progress Column */}
            <Droppable droppableId="inProgress">
              {(provided) => (
                <Card
                  sx={{ width: "43%", mr: 5, p: 2, mb: 2, borderRadius: 5, boxShadow: 5 }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <MDTypography variant="h4" sx={{ textAlign: "center" }}>
                    Assigned Job Roles
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
