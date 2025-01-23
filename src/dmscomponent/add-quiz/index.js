import React, { useState } from "react";
import { Card, MenuItem, TextField, IconButton, List, ListItem } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCreateTrainingQuizMutation } from "apilms/quizapi";

function CreateQuiz() {
  const [quizName, setQuizName] = useState("");
  const [passCriteria, setPassCriteria] = useState("");
  const [quizTime, setQuizTime] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [quizType, setQuizType] = useState("Auto");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [availableQuestions] = useState([
    { id: 1, text: "Question 1", marks: 5 },
    { id: 2, text: "Question 2", marks: 10 },
    { id: 3, text: "Question 3", marks: 15 },
  ]);
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().slice(0, 10));
  const [createdBy, setCreatedBy] = useState(""); // Replace with actual user info if needed

  // Initialize the mutation
  const [createQuiz, { isLoading, isError, error, isSuccess }] = useCreateTrainingQuizMutation();

  const handleAddQuestion = (question) => {
    if (!selectedQuestions.includes(question)) {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleRemoveQuestion = (question) => {
    setSelectedQuestions(selectedQuestions.filter((q) => q !== question));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quizData = {
      training_id: "training123", // Replace with actual training ID
      name: quizName,
      pass_criteria: passCriteria,
      quiz_time: quizTime,
      quiz_type: quizType,
      total_marks: totalMarks,
      marks_breakdown: selectedQuestions.map((q) => ({
        question_id: q.id,
        marks: q.marks,
      })),
      selected_questions: selectedQuestions.map((q) => q.id),
    };

    try {
      const response = await createQuiz(quizData).unwrap();
      console.log("Quiz Created Successfully:", response);
      alert("Quiz created successfully!");
      // Reset form
      setQuizName("");
      setPassCriteria("");
      setQuizTime("");
      setTotalMarks("");
      setTotalQuestions("");
      setSelectedQuestions([]);
    } catch (err) {
      console.error("Error creating quiz:", err);
      alert("Failed to create quiz. Please try again.");
    }
  };

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
                type="text"
                label="Pass Criteria"
                fullWidth
                value={passCriteria}
                onChange={(e) => setPassCriteria(e.target.value)}
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
              <TextField
                select
                label="Quiz Type"
                fullWidth
                value={quizType}
                onChange={(e) => setQuizType(e.target.value)}
              >
                <MenuItem value="Auto">Auto</MenuItem>
                <MenuItem value="Manual">Manual</MenuItem>
              </TextField>
            </MDBox>
            {quizType === "Manual" && (
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
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit" disabled={isLoading}>
                {isLoading ? "Creating Quiz..." : "Create Quiz"}
              </MDButton>
            </MDBox>
            {isError && <MDTypography color="error">Failed to create quiz: {error.data?.message}</MDTypography>}
            {isSuccess && <MDTypography color="success">Quiz created successfully!</MDTypography>}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default CreateQuiz;
