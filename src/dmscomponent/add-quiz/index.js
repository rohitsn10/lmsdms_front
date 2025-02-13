import React, { useState, useEffect } from "react";
import {
  Card,
  MenuItem,
  TextField,
  IconButton,
  List,
  ListItem,
  Select,
  OutlinedInput,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useCreateTrainingQuizMutation } from "apilms/quizapi";
import { useFetchTrainingWiseQuestionsQuery } from "apilms/questionApi";
import { useLocation,useNavigate } from "react-router-dom";
import { FormControl, InputLabel } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateQuiz() {
  const location = useLocation();
  const { DataQuiz } = location.state || {};
  const navigate = useNavigate();
  const [quizName, setQuizName] = useState("");
  const [passCriteria, setPassCriteria] = useState("");
  const [quizTime, setQuizTime] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [quizType, setQuizType] = useState("Auto");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [markBreakdown, setMarkBreakdown] = useState([]); // Changed to an array for dynamic entries
  const [availableQuestions, setAvailableQuestions] = useState([]);
 

  const { data, isLoading, isError } = useFetchTrainingWiseQuestionsQuery(DataQuiz?.id);
  const [createQuiz, { isLoading: isQuizLoading, isError: isQuizError }] =
    useCreateTrainingQuizMutation();

  // Set available questions from API response
  useEffect(() => {
    if (data && data.status) {
      setAvailableQuestions(data.data);
    }
  }, [data]);

  // Handle adding a new mark breakdown entry
  const handleAddMarkBreakdown = () => {
    setMarkBreakdown([...markBreakdown, { mark: "", count: "" }]);
  };
  // Handle updating a mark breakdown entry
  const handleMarkBreakdownChange = (index, field, value) => {
    const updatedBreakdown = [...markBreakdown];
    updatedBreakdown[index][field] = value;
    setMarkBreakdown(updatedBreakdown);
  };
  // Handle removing a mark breakdown entry
  const handleRemoveMarkBreakdown = (index) => {
    const updatedBreakdown = markBreakdown.filter((_, i) => i !== index);
    setMarkBreakdown(updatedBreakdown);
  };

  // Handle Pass Criteria change
  const handlePassCriteriaChange = (e) => {
    const value = e.target.value;
    if (parseFloat(value) <= parseFloat(totalMarks)) {
      setPassCriteria(value); // Only update if valid
    } else {
      toast("Pass Criteria cannot be greater than Total Marks.");
    }
  };

  const handleAddQuestion = (question) => {
    if (!selectedQuestions.includes(question)) {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleRemoveQuestion = (question) => {
    setSelectedQuestions(selectedQuestions.filter((q) => q !== question));
  };
  const [errorMessages, setErrorMessages] = useState([]);

  const isSubmitDisabled = () => {
    // Check if required fields are empty
    if (!quizName || !passCriteria || !quizTime || !totalMarks || !totalQuestions) {
      return true;
    }

    // Check if pass criteria is greater than total marks
    if (parseFloat(passCriteria) > parseFloat(totalMarks)) {
      return true;
    }

    // Check if quiz type is "auto" and mark breakdown is invalid
    if (quizType === "auto") {
      const totalMarksBreakdown = markBreakdown.reduce((sum, entry) => {
        const { mark, count } = entry;
        return sum + (parseInt(mark) * parseInt(count) || 0);
      }, 0);

      // Check if total marks breakdown exceeds total marks
      if (totalMarksBreakdown > parseFloat(totalMarks)) {
        return true;
      }

      // Check if there are enough questions for each mark breakdown
      for (const entry of markBreakdown) {
        const { mark, count } = entry;
        const availableForMark = availableQuestions.filter((q) => q.marks === parseInt(mark));

        if (availableForMark.length < count) {
          return true;
        }
      }
    }

    // Check if quiz type is "manual" and no questions are selected
    if (quizType === "manual" && selectedQuestions.length === 0) {
      return true;
    }

    // If all checks pass, enable the button
    return false;
  };
  useEffect(() => {
    if (parseFloat(passCriteria) > parseFloat(totalMarks)) {
      toast.error("Pass Criteria cannot be greater than Total Marks!");
    }
    if (
      markBreakdown.some(
        (entry) => parseInt(entry.mark) * parseInt(entry.count) > parseFloat(totalMarks)
      )
    ) {
      toast.error("Mark breakdown exceeds total quiz marks.");
    }
  }, [passCriteria, totalMarks, markBreakdown]);

  // Inside the `handleSubmit` function, replace the `alert` with toast notifications:
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!quizName || !passCriteria || !quizTime || !totalMarks || !totalQuestions) {
      toast.error("Please fill out all required fields.");
      return;
    }

    // Validate pass criteria
    if (parseFloat(passCriteria) > parseFloat(totalMarks)) {
      toast.error("Pass Criteria cannot be greater than Total Marks.");
      return;
    }

    // Validate mark breakdown for auto quiz
    if (quizType === "auto") {
      const totalMarksBreakdown = markBreakdown.reduce((sum, entry) => {
        const { mark, count } = entry;
        return sum + (parseInt(mark) * parseInt(count) || 0);
      }, 0);

      if (totalMarksBreakdown > parseFloat(totalMarks)) {
        toast.error("Total marks from breakdown exceed total quiz marks.");
        return;
      }

      for (const entry of markBreakdown) {
        const { mark, count } = entry;
        const availableForMark = availableQuestions.filter((q) => q.marks === parseInt(mark));

        if (availableForMark.length < count) {
          toast.error(`Not enough questions for ${mark} mark. Please adjust your mark breakdown.`);
          return;
        }
      }
    }

    // Validate manual quiz
    if (quizType === "manual" && selectedQuestions.length === 0) {
      toast.error("Please select at least one question for the quiz.");
      return;
    }
    const transformedMarksBreakdown = markBreakdown.reduce((acc, item) => {
      acc[item.mark] = item.count;
      return acc;
    }, {});
   
    const quizData = {
      document_id: DataQuiz?.id,
      name: quizName,
      pass_criteria: passCriteria,
      quiz_time: quizTime,
      quiz_type: quizType,
      total_marks: totalMarks,
      selected_questions: quizType === "auto" ? [] : selectedQuestions.map((q) => q.id),
      marks_breakdown: quizType === "auto" ? transformedMarksBreakdown : [],
    };

    try {
      await createQuiz(quizData).unwrap();
      toast.success("Quiz created successfully!");
      // Reset the form
      setQuizName("");
      setPassCriteria("");
      setQuizTime("");
      setTotalMarks("");
      setTotalQuestions("");
      setSelectedQuestions([]);
      setMarkBreakdown([]);
      navigate("/trainingListing");
    } catch (err) {
      toast.error("Failed to create quiz. Please try again.");
    }
  };
  if (isLoading) return <div>Loading available questions...</div>;
  if (isError) return <div>Error fetching available questions.</div>;

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
            Create Quiz
          </MDTypography>
        </MDBox>

        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            {/* Other Fields */}
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Quiz Name"
                fullWidth
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-quiz-type-label">Quiz Type</InputLabel>
                <Select
                  labelId="select-quiz-type-label"
                  id="select-quiz-type"
                  value={quizType}
                  onChange={(e) => setQuizType(e.target.value)}
                  input={<OutlinedInput label="Quiz Type" />}
                  sx={{
                    minWidth: 200,
                    height: "3rem",
                    ".MuiSelect-select": {
                      padding: "0.45rem",
                    },
                  }}
                >
                  <MenuItem value="auto">Auto</MenuItem>
                  <MenuItem value="manual">Manual</MenuItem>
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="number"
                label="Total Quiz Marks"
                fullWidth
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="number"
                label="Total Questions"
                fullWidth
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Pass Criteria"
                fullWidth
                value={passCriteria}
                onChange={handlePassCriteriaChange}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="number"
                label="Quiz Time (in minutes)"
                fullWidth
                value={quizTime}
                onChange={(e) => setQuizTime(e.target.value)}
              />
            </MDBox>

            {quizType === "manual" && (
              <MDBox mb={3}>
                <MDTypography variant="h6" fontWeight="medium">
                  Select Questions
                </MDTypography>
                <List>
                  {availableQuestions.map((question) => (
                    <ListItem key={question.id}>
                      <MDTypography variant="body2">
                        {question.text} (Marks: {question.marks})
                      </MDTypography>
                      <IconButton
                        edge="end"
                        aria-label="add"
                        onClick={() => handleAddQuestion(question)}
                      >
                        +
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
                <MDTypography variant="h6" fontWeight="medium">
                  Selected Questions
                </MDTypography>
                <List>
                  {selectedQuestions.map((question) => (
                    <ListItem key={question.id}>
                      <MDTypography variant="body2">
                        {question.text} (Marks: {question.marks})
                      </MDTypography>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveQuestion(question)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </MDBox>
            )}

            {quizType === "auto" && (
              <MDBox mb={3}>
                <MDTypography variant="h6" fontWeight="medium">
                  Mark Breakdown
                </MDTypography>
                {markBreakdown.map((entry, index) => (
                  <MDBox
                    key={index}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap={2}
                    mb={2}
                  >
                    <TextField
                      label="Mark"
                      type="number"
                      value={entry.mark}
                      onChange={(e) => handleMarkBreakdownChange(index, "mark", e.target.value)}
                    />
                    <TextField
                      label="Number of Questions"
                      type="number"
                      value={entry.count}
                      onChange={(e) => handleMarkBreakdownChange(index, "count", e.target.value)}
                    />
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveMarkBreakdown(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </MDBox>
                ))}
                <MDButton
                  variant="gradient"
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={handleAddMarkBreakdown}
                >
                  Add Mark Breakdown
                </MDButton>
                {markBreakdown.map((entry, index) => {
                  const { mark, count } = entry;
                  const available = availableQuestions.filter((q) => q.marks === parseInt(mark));
                  return (
                    <MDTypography
                      key={index}
                      variant="body2"
                      color={
                        Number(count) <= (Array.isArray(available) ? available.length : 0)
                          ? "error"
                          : "error"
                      }
                    >
                      Need {count} questions for {mark} mark, available:{" "}
                      {Array.isArray(available) ? available.length : 0}
                    </MDTypography>
                  );
                })}
              </MDBox>
            )}
            <MDBox mb={3}>
              {errorMessages.length > 0 && (
                <MDTypography variant="body2" color="error" align="left">
                  {errorMessages.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton
                variant="gradient"
                color="submit"
                fullWidth
                type="submit"
                disabled={isQuizLoading || isSubmitDisabled()}
              >
                {isQuizLoading ? "Creating Quiz..." : "Create Quiz"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default CreateQuiz;
