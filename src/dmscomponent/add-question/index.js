// AddQuestion.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  MenuItem,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import ESignatureDialog from "layouts/authentication/ESignatureDialog";
import DeleteIcon from "@mui/icons-material/Delete";

function AddQuestion() {
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("MCQ");
  const [answers, setAnswers] = useState([""]);
  const [questionMarks, setQuestionMarks] = useState("");
  const [questionLanguage, setQuestionLanguage] = useState("");
  const [status, setStatus] = useState("Active");
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().slice(0, 10));
  const [createdBy, setCreatedBy] = useState(""); // Replace with actual user info if needed
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);

  const navigate = useNavigate();

  const handleAddQuestion = (e) => {
    e.preventDefault();
    const newQuestion = {
      text: questionText,
      type: questionType,
      answers: answers,
      marks: questionMarks,
      language: questionLanguage,
      status: status,
      createdAt: createdAt,
      createdBy: createdBy,
    };
    setQuestions([...questions, newQuestion]);
    // Reset fields
    setQuestionText("");
    setQuestionType("MCQ");
    setAnswers([""]);
    setQuestionMarks("");
    setQuestionLanguage("");
    setStatus("Active");
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, ""]);
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleRemoveAnswer = (index) => {
    const updatedAnswers = answers.filter((_, i) => i !== index);
    setAnswers(updatedAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Questions Submitted:", questions);
    setOpenSignatureDialog(true);
  };

  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false);
    navigate("/dashboard"); // Redirect to dashboard or any other route
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
            Add Question
          </MDTypography>
        </MDBox>

        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Add Question"
                fullWidth
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </MDBox>

            <MDBox mb={3}>
              <TextField
                select
                label="Question Type"
                fullWidth
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                sx={{
                  height: "40px", // Set desired height here
                  "& .MuiInputBase-root": {
                    minHeight: "2.4265em",
                    height: "100%", // Ensures the inner select aligns with the specified height
                  },
                }}
              >
                <MenuItem value="Fill in the blank">Fill in the blank</MenuItem>
                <MenuItem value="MCQ">MCQ</MenuItem>
                <MenuItem value="True/False">True/False</MenuItem>
              </TextField>
            </MDBox>

            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium">
                Add Answers
              </MDTypography>
              <List>
                {answers.map((answer, index) => (
                  <ListItem key={index}>
                    <MDInput
                      type="text"
                      placeholder={`Answer ${index + 1}`}
                      value={answer}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      sx={{ flex: 1, marginRight: 1 }}
                    />
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveAnswer(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <MDButton variant="outlined" color="success" onClick={handleAddAnswer}>
                Add Answer
              </MDButton>
            </MDBox>

            <MDBox mb={3}>
              <MDInput
                type="number"
                label="Question Marks"
                fullWidth
                value={questionMarks}
                onChange={(e) => setQuestionMarks(e.target.value)}
              />
            </MDBox>

            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Question Language"
                fullWidth
                value={questionLanguage}
                onChange={(e) => setQuestionLanguage(e.target.value)}
              />
            </MDBox>

            <MDBox mb={3}>
              <TextField
                select
                label="Status"
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{
                  height: "40px", // Set desired height here
                  "& .MuiInputBase-root": {
                    minHeight: "2.4265em",
                    height: "100%", // Ensures the inner select aligns with the specified height
                  },
                }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </MDBox>

            <MDBox mb={3}>
              <MDInput
                type="date"
                label="Created At"
                fullWidth
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
              />
            </MDBox>

            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Created By"
                fullWidth
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
              />
            </MDBox>

            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit">
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* E-Signature Dialog */}
      <ESignatureDialog
        open={openSignatureDialog}
        handleClose={handleCloseSignatureDialog}
      />
    </BasicLayout>
  );
}

export default AddQuestion;
