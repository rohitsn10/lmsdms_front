import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  Chip,
  Alert,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useFetchTrainingsQuery } from "apilms/trainingApi";
import { useGetJobRoleQuery } from "apilms/jobRoleApi";
import { useTrainingAssignJobroleMutationMutation, useTrainingAssignJobroleQuery } from "apilms/MappingApi";
import { toast } from "react-toastify";
import MDButton from "components/MDButton";

const JobRoleMapping = () => {
  const [selectedJobRole, setSelectedJobRole] = useState("");
  const [selectedTrainings, setSelectedTrainings] = useState([]);
  const [assignedTrainings, setAssignedTrainings] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: trainingData, isLoading: trainingLoading } = useFetchTrainingsQuery();
  const { data: jobRoleData, isLoading: jobRoleLoading } = useGetJobRoleQuery();
  const [assignTrainings] = useTrainingAssignJobroleMutationMutation();
  // console.log()
  // Fetch already assigned trainings when job role is selected
  const { 
    data: assignedTrainingData, 
    isLoading: assignedTrainingIsLoading 
  } = useTrainingAssignJobroleQuery(selectedJobRole, { 
    skip: !selectedJobRole 
  });

  // Initialize assigned trainings when job role changes or when fetching completes
  useEffect(() => {
    if (selectedJobRole && assignedTrainingData?.documents) {
      // Extract document_id from each assigned training
      const existingAssignments = assignedTrainingData.documents.map(doc => doc.document_id);
      setAssignedTrainings(existingAssignments);
    } else if (selectedJobRole && !assignedTrainingIsLoading) {
      // Clear assignments if no data is found
      setAssignedTrainings([]);
    }
  }, [selectedJobRole, assignedTrainingData, assignedTrainingIsLoading]);

  // Reset selections when training data changes
  useEffect(() => {
    if (trainingData) {
      setSelectedTrainings([]);
    }
  }, [trainingData]);

  const handleJobRoleChange = (e) => {
    const newJobRole = e.target.value;
    setSelectedJobRole(newJobRole);
    // Reset selections when job role changes
    setSelectedTrainings([]);
  };

  const handleAssign = () => {
    setAssignedTrainings((prev) => [...prev, ...selectedTrainings]);
    setSelectedTrainings([]);
  };

  const handleUnassign = (trainingId) => {
    setAssignedTrainings((prev) => prev.filter((id) => id !== trainingId));
  };

  const handleToggleSelect = (trainingId) => {
    setSelectedTrainings((prev) => 
      prev.includes(trainingId)
        ? prev.filter(id => id !== trainingId)
        : [...prev, trainingId]
    );
  };
  
  const handleSelectAll = () => {
    const availableTrainings = getAvailableTrainings();
    const availableIds = availableTrainings.map(training => training.id || training.document_id);
    
    if (availableIds.length === selectedTrainings.length) {
      setSelectedTrainings([]);
    } else {
      setSelectedTrainings(availableIds);
    }
  };

  const handleSubmit = async () => {
    if (!selectedJobRole) {
      toast.warning("Please select a job role first");
      return;
    }
    
    if (assignedTrainings.length === 0) {
      toast.warning("Please assign at least one training");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await assignTrainings({ 
        job_role_id: selectedJobRole, 
        document_ids: assignedTrainings 
      });
      toast.success("Training assigned successfully!");
      // Don't reset assigned trainings as they're now persisted
    } catch (err) {
      toast.error("Error assigning training");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the job role name for display
  const getJobRoleName = () => {
    if (!selectedJobRole || !jobRoleData?.data) return "";
    const jobRole = jobRoleData.data.find(job => job.id === selectedJobRole);
    return jobRole?.job_role_name || "";
  };

  // Filter out already assigned trainings from available list
  const getAvailableTrainings = () => {
    if (!trainingData?.document_data?.documents) return [];
    
    return trainingData.document_data.documents.filter(training => {
      const trainingId = training.id || training.document_id;
      return !assignedTrainings.includes(trainingId);
    });
  };

  // Get training objects for assigned IDs
  // const getAssignedTrainingObjects = () => {
  //   if (assignedTrainingData?.documents) {
  //     return assignedTrainingData.documents;
  //   }
  //       if (!trainingData?.document_data?.documents) return [];
  //   console.log("NENENE",assignedTrainings)
  //   return assignedTrainings.map(id => {
  //     const training = trainingData.document_data.documents.find(t => 
  //       (t.id === id || t.document_id === id)
  //     );
  //     return training;
  //   }).filter(Boolean);
  // };
  const getAssignedTrainingObjects = () => {
    if (!trainingData?.document_data?.documents) return [];
    
    return assignedTrainings.map(id => {
      const training = trainingData.document_data.documents.find(t => 
        t.id === id || t.document_id === id
      );
      return training;
    }).filter(Boolean);
  };

  // Normalize training object structure from different data sources
  const normalizeTraining = (training) => {
    return {
      id: training.id || training.document_id,
      title: training.document_title,
      type: training.document_type || 'Training Document',
      status: training.document_current_status_name || null
    };
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 900, mx: "auto", my: 4, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
        Job Role   Training Mapping
      </Typography>
      <Divider sx={{ mb: 4 }} />
      
      {/* Job Role Selection */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardHeader 
          title="Select Job Role" 
          subheader="Choose a job role to assign training to"
          avatar={
            <Tooltip title="First select a job role before assigning trainings">
              <InfoIcon color="info" />
            </Tooltip>
          }
        />
        <CardContent>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="job-role-label">Job Role</InputLabel>
            <Select
              labelId="job-role-label"
              value={selectedJobRole}
              onChange={handleJobRoleChange}
              label="Job Role"
              disabled={jobRoleLoading}
              sx={{
                padding:'10px'
              }}
            >
              {jobRoleData?.data?.map((job) => (
                <MenuItem key={job.id} value={job.id}>
                  {job.job_role_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {selectedJobRole && (
            <Chip 
              label={`Selected: ${getJobRoleName()}`} 
              color="primary" 
              sx={{ mt: 2 }}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Training Assignment Section */}
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
        {/* Available Training */}
        <Card elevation={2} sx={{ flex: 1 }}>
          <CardHeader 
            title="Available Training" 
            subheader="Select trainings to assign"
            action={
              <Button 
                size="small" 
                onClick={handleSelectAll}
                disabled={trainingLoading || getAvailableTrainings().length === 0}
              >
                {selectedTrainings.length === getAvailableTrainings().length ? 'Deselect All' : 'Select All'}
              </Button>
            }
          />
          <Divider />
          <CardContent sx={{ maxHeight: 400, overflow: 'auto' }}>
            {trainingLoading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
                <Typography ml={2}>Loading trainings...</Typography>
              </Box>
            ) : getAvailableTrainings().length === 0 ? (
              <Alert severity="info">
                No available trainings to assign
              </Alert>
            ) : (
              <List dense>
                {getAvailableTrainings().map((training) => {
                  const normalizedTraining = normalizeTraining(training);
                  return (
                    <ListItem 
                      key={normalizedTraining.id} 
                      button 
                      onClick={() => handleToggleSelect(normalizedTraining.id)}
                      sx={{ 
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                      }}
                    >
                      <ListItemIcon>
                        <Checkbox 
                          edge="start"
                          checked={selectedTrainings.includes(normalizedTraining.id)} 
                          color="primary"
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={normalizedTraining.title} 
                        secondary={normalizedTraining.type}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </CardContent>
          <Divider />
          <Box p={2} display="flex" justifyContent="flex-end">
            <MDButton
              variant="contained"
              color="primary"
              startIcon={<ArrowForwardIcon />}
              onClick={handleAssign}
              disabled={selectedTrainings.length === 0}
            >
              Assign Selected
            </MDButton>
          </Box>
        </Card>
        
        {/* Assigned Training */}
        <Card elevation={2} sx={{ flex: 1 }}>
          <CardHeader 
            title="Assigned Training" 
            subheader={
              selectedJobRole 
                ? `Trainings assigned to ${getJobRoleName()}`
                : "Select a job role first"
            }
          />
          <Divider />
          <CardContent sx={{ maxHeight: 400, overflow: 'auto' }}>
            {!selectedJobRole ? (
              <Alert severity="info">
                Select a job role to see assigned trainings
              </Alert>
            ) : assignedTrainingIsLoading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
                <Typography ml={2}>Loading assigned trainings...</Typography>
              </Box>
            ) : assignedTrainings.length === 0 ? (
              <Alert severity="info">
                No trainings assigned to this job role
              </Alert>
            ) : (
              <List dense>
                {getAssignedTrainingObjects().map((training) => {
                  const normalizedTraining = normalizeTraining(training);
                  return (
                    <ListItem 
                      key={normalizedTraining.id}
                      sx={{ 
                        borderRadius: 1,
                        mb: 0.5,
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                      }}
                    >
                      <ListItemText 
                        primary={normalizedTraining.title}
                        sx={{
                          padding:'10px'
                        }}
                        secondary={
                          <Box component="span">
                            <Typography variant="body2" component="span">
                              {normalizedTraining.type}
                            </Typography>
                            {normalizedTraining.status && (
                              <Chip 
                                size="small" 
                                label={normalizedTraining.status} 
                                color="info" 
                                variant="outlined"
                                sx={{ ml: 1, height: 20 }}
                              />
                            )}
                          </Box>
                        }
                      />
                      <IconButton
                        edge="end"
                        aria-label="remove"
                        onClick={() => handleUnassign(normalizedTraining.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>
      
      {/* Submit Button */}
      <Box display="flex" justifyContent="center" mt={4}>
        <MDButton
          variant="gradient"
          color="submit"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={!selectedJobRole || assignedTrainings.length === 0 || isSubmitting}
          sx={{ px: 4, py: 1 }}
        >
          {isSubmitting ? "Saving..." : "Save Mappings"}
        </MDButton>
      </Box>
      
      {/* Summary */}
      {selectedJobRole && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            {assignedTrainings.length > 0 ? (
              <>Ready to assign {assignedTrainings.length} training{assignedTrainings.length !== 1 ? 's' : ''} to {getJobRoleName()}</>
            ) : (
              <>No trainings currently assigned to {getJobRoleName()}</>
            )}
          </Typography>
        </Alert>
      )}
    </Paper>
  );
};

export default JobRoleMapping;