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
import { useUserListQuery } from "api/auth/userApi";
import { useGetJobRoleQuery } from "apilms/jobRoleApi";
import { useJobroleAssignTrainingMutation } from "apilms/MappingApi"; 
import { toast } from "react-toastify"; 

const TrainingMapping = () => {
  const [selectedUser, setSelectedUser] = useState(""); 
  const [selectedJobRole, setSelectedJobRole] = useState([]); 
  const [kanbanData, setKanbanData] = useState({
    toDo: [],
    inProgress: [],
  });
  const { data: userData, error: userError, isLoading: userLoading } = useUserListQuery();
  const { data: jobRoleData, error: jobRoleError, isLoading: jobRoleLoading } = useGetJobRoleQuery();
  const [jobroleAssignTraining, { isLoading: isMappingLoading }] = useJobroleAssignTrainingMutation();

  useEffect(() => {
    if (jobRoleData) {
      // Initialize the 'toDo' list with job roles when fetched
      setKanbanData((prev) => ({
        ...prev,
        toDo: jobRoleData.data.map((role) => ({
          id: role.id.toString(),
          title: role.job_role_name,
        })),
      }));
    }
  }, [jobRoleData]);

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    if (
      sourceColumn === destColumn &&
      source.index === destination.index
    ) {
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

    // If item was moved to the "inProgress" column, set it as the selected job role
    if (destColumn === "inProgress") {
      // Ensure job role is set as an integer
      setSelectedJobRole((prevState) => [...prevState, parseInt(removed.id, 10)]); // Add new ID to selectedJobRole
    }
  };

  const handleMapping = async () => {
    if (!selectedUser || selectedJobRole.length === 0) {
      toast.error("Please select both a user and at least one job role!");
      return;
    }

    try {
      // Ensure job_role_ids is passed as an array of integers
      await jobroleAssignTraining({
        user_id: selectedUser,
        job_role_ids: selectedJobRole, // Multiple job role IDs in an array
      }).unwrap();

      // Success toast notification
      toast.success(`User ${selectedUser} successfully mapped to Job Roles: ${selectedJobRole.join(", ")}`);
    } catch (error) {
      // Error toast notification
      toast.error("Error occurred while mapping job roles.");
    }
  };

  if (userLoading || jobRoleLoading) {
    return <div>Loading...</div>;
  }

  if (userError || jobRoleError) {
    return <div>Error occurred while fetching data</div>;
  }

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center" justifyContent="center">
          {/* User Dropdown */}
          <FormControl fullWidth margin="dense" sx={{ width: "250px", ml: 5 }}>
  <InputLabel id="select-user-label">Select User</InputLabel>
  <Select
    labelId="select-user-label"
    id="select-user"
    value={selectedUser}
    onChange={(e) => setSelectedUser(e.target.value)}
    input={<OutlinedInput label="Select User" />}
    sx={{
      minWidth: 150,
      height: "2.4rem",
      ".MuiSelect-select": { padding: "0.45rem" },
    }}
  >
    {userData.data
      .filter((user) => user.is_jr_approve) // Filter users where is_jr_approve is true
      .map((user) => (
        <MenuItem key={user.id} value={user.id}>
          {user.full_name}
        </MenuItem>
      ))}
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
            disabled={isMappingLoading} // Disable the button during loading
          >
            {isMappingLoading ? "Mapping..." : "Mapping"}
          </MDButton>
        </MDBox>

        {/* Drag and Drop Context */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <MDBox display="flex" justifyContent="center" alignItems="center">
            {/* To Do Column (Job Role List) */}
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
            {/* In Progress Column (Assigned Roles) */}
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
