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
import { useClassroomQuestionsGetQuery,useClassroomQuizPostMutation } from "apilms/classtestApi"; // Updated hook for class quiz
import { useLocation, useNavigate } from "react-router-dom";
import { FormControl, InputLabel } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateClassQuiz() {
  const location = useLocation(); 
  const classroom_id = (location?.state?.classroom_id || "").toString();
  const navigate = useNavigate();
  const [quizName, setQuizName] = useState("");
  const [passCriteria, setPassCriteria] = useState("");
  const [quizTime, setQuizTime] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);

  const { data, isLoading, isError } = useClassroomQuestionsGetQuery(classroom_id);
  const [createClassQuiz, { isLoading: isQuizLoading, isError: isQuizError }] = useClassroomQuizPostMutation();

  // Set available questions from API response
  useEffect(() => {
    if (data && data.status) {
      setAvailableQuestions(data.data);
    }
  }, [data]);

  const handleAddQuestion = (question) => {
    if (!selectedQuestions.includes(question)) {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleRemoveQuestion = (question) => {
    setSelectedQuestions(selectedQuestions.filter((q) => q !== question));
  };

  const handlePassCriteriaChange = (e) => {
    const value = e.target.value;
    if (parseFloat(value) <= parseFloat(totalMarks)) {
      setPassCriteria(value); // Only update if valid
    } else {
      toast("Pass Criteria cannot be greater than Total Marks.");
    }
  };

  const isSubmitDisabled = () => {
    if (!quizName || !passCriteria || !quizTime || !totalMarks || !totalQuestions) {
      return true;
    }
    if (parseFloat(passCriteria) > parseFloat(totalMarks)) {
      return true;
    }
    if (selectedQuestions.length === 0) {
      return true;
    }
    return false;
  };

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

    // Validate manual quiz
    if (selectedQuestions.length === 0) {
      toast.error("Please select at least one question for the quiz.");
      return;
    }

    const quizData = {
        classroom_id,
      name: quizName,
      pass_criteria: passCriteria,
      quiz_time: quizTime,
      total_marks: totalMarks,
      selected_questions: selectedQuestions.map((q) => q.id),
    };

    try {
      await createClassQuiz(quizData).unwrap();
      toast.success("Quiz created successfully!");
      // Reset the form
      setQuizName("");
      setPassCriteria("");
      setQuizTime("");
      setTotalMarks("");
      setTotalQuestions("");
      setSelectedQuestions([]);
      navigate("/class-room");
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
            Create Class Quiz
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

            {/* Question selection */}
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium">
                Select Questions
              </MDTypography>
              <List>
                {availableQuestions.map((question) => (
                  <ListItem key={question.id}>
                    <MDTypography variant="body2">
                      {question.question_text} (Marks: {question.marks})
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
                      {question.question_text} (Marks: {question.marks})
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

export default CreateClassQuiz;
