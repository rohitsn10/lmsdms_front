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
import { useClassroomQuestionsGetQuery, useClassroomQuizEditMutation } from "apilms/classtestApi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditClassQuiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz } = location.state || {}; 
  const {classroom_id} = location.state || {};
  const [quizName, setQuizName] = useState(quiz?.quiz_name || "");
  const [passCriteria, setPassCriteria] = useState(
    quiz?.pass_criteria ? parseInt(quiz.pass_criteria, 10) : ""
  );  
  const [quizTime, setQuizTime] = useState(quiz?.quiz_time?.split(" ")[0] || "");
  const [totalMarks, setTotalMarks] = useState(quiz?.total_marks || "");
  const [selectedQuestions, setSelectedQuestions] = useState(quiz?.questions || []);
  const [availableQuestions, setAvailableQuestions] = useState([]);

  const { data, isLoading, isError } = useClassroomQuestionsGetQuery(classroom_id);
  const [updateClassQuiz, { isLoading: isUpdating }] = useClassroomQuizEditMutation();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizName || !passCriteria || !quizTime || !totalMarks || selectedQuestions.length === 0) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const quizData = {
      id: quiz.id,
      classroom_id,
      name: quizName,
      pass_criteria: passCriteria,
      quiz_time: quizTime,
      total_marks: totalMarks,
      selected_questions: selectedQuestions.map((q) => q.id),
    };

    try {
      await updateClassQuiz(quizData).unwrap();
      toast.success("Quiz updated successfully!");
      navigate("/class-room");
    } catch (err) {
      toast.error("Failed to update quiz. Please try again.");
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
            Edit Class Quiz
          </MDTypography>
        </MDBox>

        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <MDInput type="text" label="Quiz Name" fullWidth value={quizName} onChange={(e) => setQuizName(e.target.value)} />
            </MDBox>
            <MDBox mb={3}>
              <MDInput type="number" label="Total Marks" fullWidth value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} />
            </MDBox>
            <MDBox mb={3}>
              <MDInput type="text" label="Pass Criteria" fullWidth value={passCriteria} onChange={(e) => setPassCriteria(e.target.value)} />
            </MDBox>
            <MDBox mb={3}>
              <MDInput type="number" label="Quiz Time (in minutes)" fullWidth value={quizTime} onChange={(e) => setQuizTime(e.target.value)} />
            </MDBox>

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
                    <IconButton edge="end" onClick={() => handleAddQuestion(question)}>+</IconButton>
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
                    <IconButton edge="end" onClick={() => handleRemoveQuestion(question)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </MDBox>

            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating Quiz..." : "Update Quiz"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default EditClassQuiz;
