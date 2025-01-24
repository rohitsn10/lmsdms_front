import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, MenuItem, Select, InputLabel, FormControl, Grid, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import MDButton from "components/MDButton";
import OutlinedInput from '@mui/material/OutlinedInput';
import { useCreateSessionMutation } from 'apilms/classRoomApi'; // Import your mutation hook
import { useUserListQuery } from "api/auth/userApi"; // Import user list query

function AddSession() {
  const [sessionName, setSessionName] = useState("");
  const [sessionVenue, setSessionVenue] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const location = useLocation();
  const classroomId = location.state?.classroomId;

  // Get the mutation hook
  const [createSession, { isLoading, error }] = useCreateSessionMutation();

  // Fetch the user list
  const { data: userData, isLoading: isUserLoading, error: userError } = useUserListQuery();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the session data
    const sessionData = {
      session_name: sessionName,
      venue: sessionVenue,
      start_date: sessionDate,
      end_date: sessionDate,  // Assuming start and end date are the same for simplicity, adjust if necessary
      start_time: sessionTime,
      end_time: sessionTime,  // Assuming start and end time are the same for simplicity, adjust if necessary
      user_ids: selectedUsers, // Pass an array of selected user IDs
      classroom_id: classroomId,
    };

    // Call the mutation
    createSession(sessionData)
      .unwrap()  // To handle promise resolution
      .then((response) => {
        console.log("Session created successfully:", response);
        // Handle success, show notification or redirect, etc.
      })
      .catch((err) => {
        console.error("Error creating session:", err);
        // Handle error, show notification or alert
      });
  };

  // Handle user selection change
  const handleUserChange = (e) => {
    setSelectedUsers(e.target.value); // Update selected users
  };

  // Loading and error handling for user list
  if (isUserLoading) return <p>Loading users...</p>;
  if (userError) return <p>Error loading users: {userError.message}</p>;

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 600, mx: "auto" }}>
        <MDBox
          borderRadius="lg"
          sx={{
            background: "linear-gradient(212deg, #d5b282, #f5e0c3)",
            borderRadius: "lg",
            mx: 2,
            mt: -3,
            p: 2,
            mb: 1,
            textAlign: "center",
          }}
        >
          <MDTypography variant="h3" fontWeight="medium" color="#344767" mt={1}>
            Session Form
          </MDTypography>
        </MDBox>

        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Session Name"
                  fullWidth
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Session Venue"
                  fullWidth
                  value={sessionVenue}
                  onChange={(e) => setSessionVenue(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  label="Session Date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="time"
                  label="Session Time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <MDBox mb={3}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="select-user-label">Select Users</InputLabel>
                    <Select
                      labelId="select-user-label"
                      id="select-user"
                      multiple // Enable multiple selection
                      value={selectedUsers} // Use an array to hold selected values
                      onChange={handleUserChange} // Update the handler for multiple selection
                      input={<OutlinedInput label="Select Users" />}
                      sx={{
                        minWidth: 200,
                        height: "3rem",
                        ".MuiSelect-select": { padding: "0.45rem" },
                      }}
                      renderValue={(selected) =>
                        selected
                          .map((userId) => {
                            const user = userData?.data.find((u) => u.id === userId);
                            return user?.username || userId;
                          })
                          .join(", ")
                      }
                    >
                      {userData?.data.length > 0 ? (
                        userData.data.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.username} {/* Display username */}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No users available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </MDBox>
              </Grid>
            </Grid>

            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Session"}
              </MDButton>
            </MDBox>

            {error && (
              <MDTypography color="error" variant="body2" align="center">
                Failed to create session: {error.message}
              </MDTypography>
            )}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default AddSession;
