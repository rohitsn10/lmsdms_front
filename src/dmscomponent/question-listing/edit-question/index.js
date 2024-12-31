import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  List,
  ListItem,
  FormControlLabel,
  Radio,
  RadioGroup,
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
import TinyMCEEditorDialog from "../add-questions/question-dialog/index";
import { useUpdateTrainingQuestionMutation } from "apilms/questionApi";
function EditQuestion() {
  const { state } = useLocation(); // Get the passed state from location
  const navigate = useNavigate();
  const [questionText, setQuestionText] = useState(state?.item?.question_text || "");
  // console.log("-++++++++++++-+-+-+",questionText)
  const [questionType, setQuestionType] = useState(state?.item?.question_type || "MCQ");
  const [answers, setAnswers] = useState(state?.item?.options || [{ text: "", isCorrect: false }]);
  const [questionMarks, setQuestionMarks] = useState(state?.item?.marks || "");
  const [questionLanguage, setQuestionLanguage] = useState(state?.item?.language || "English");
  const [status, setStatus] = useState(state?.item?.status ? "Active" : "Inactive");
  const [createdAt, setCreatedAt] = useState(
    state?.question_created_at ? state.question_created_at : new Date().toISOString().slice(0, 10)
  );
  const [updateTrainingQuestion] = useUpdateTrainingQuestionMutation();

  const [createdBy, setCreatedBy] = useState(state?.item?.created_by || "");
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [openAnswerDialog, setOpenAnswerDialog] = useState(false);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(null);
  const [mediaFile, setMediaFile] = useState(
    state?.item?.image_file_url || state?.item?.video_file_url || state?.item?.audio_file_url || null
  );

  const handleEditQuestion = (e) => {
    e.preventDefault();
    const updatedQuestion = {
      text: questionText,
      type: questionType,
      answers: answers,
      marks: questionMarks,
      language: questionLanguage,
      status: status === "Active" ? true : false,
      createdAt: createdAt,
      createdBy: createdBy,
      mediaFile: mediaFile, // Update media file if changed
    };
    // Update the questions state with the edited question
    console.log("Updated Question: ", updatedQuestion);
  };

  const handleAddAnswer = () => {
    if (answers.length < 6) {
      setAnswers([...answers, { text: "", isCorrect: false }]);
    }
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].text = value;
    setAnswers(updatedAnswers);
  };

  const handleRemoveAnswer = (index) => {
    const updatedAnswers = answers.filter((_, i) => i !== index);
    setAnswers(updatedAnswers);
  };

  const handleCorrectAnswerChange = (index) => {
    const updatedAnswers = [...answers];
    updatedAnswers.forEach((answer, i) => (answer.isCorrect = false)); // Reset all answers to incorrect
    updatedAnswers[index].isCorrect = true; // Set the selected answer as correct
    setAnswers(updatedAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Edited Question Submitted:", {
      questionText,
      questionType,
      answers,
      questionMarks,
      questionLanguage,
      status,
      mediaFile,
    });
    setOpenSignatureDialog(true);
  };

  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false);
    navigate("/questions"); // Redirect to dashboard or any other route
  };

  const handleOpenQuestionDialog = () => {
    setOpenQuestionDialog(true);
  };

  const handleCloseQuestionDialog = () => {
    setOpenQuestionDialog(false);
  };

  const handleOpenAnswerDialog = (index) => {
    setCurrentAnswerIndex(index);
    setOpenAnswerDialog(true);
  };

  const handleCloseAnswerDialog = () => {
    setOpenAnswerDialog(false);
  };

  const handleSaveQuestion = (content) => {
    setQuestionText(content);
  };

  const handleSaveAnswer = (content) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentAnswerIndex].text = content;
    setAnswers(updatedAnswers);
  };

  // Handle media file change (image/video/audio)
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMediaFile(file);
  };

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 600, mx: "auto", mt: 5, mb: 5 }}>
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
            Edit Question
          </MDTypography>
        </MDBox>

        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Edit Question"
                fullWidth
                value={questionText}
                onClick={handleOpenQuestionDialog}
              />
            </MDBox>

            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-question-type-label">Question Type</InputLabel>
                <Select
                  labelId="select-question-type-label"
                  id="select-question-type"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  input={<OutlinedInput label="Question Type" />}
                  sx={{
                    minWidth: 200,
                    height: "3rem",
                    ".MuiSelect-select": { padding: "0.45rem" },
                  }}
                >
                  <MenuItem value="Fill in the blank">Fill in the blank</MenuItem>
                  <MenuItem value="MCQ">MCQ</MenuItem>
                  <MenuItem value="True/False">True/False</MenuItem>
                </Select>
              </FormControl>
            </MDBox>

            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium">
                Add Answers
              </MDTypography>

              {questionType === "Fill in the blank" && (
                <MDInput
                  type="text"
                  placeholder="Answer"
                  value={answers[0]?.text}
                  onChange={(e) => handleAnswerChange(0, e.target.value)}
                  fullWidth
                />
              )}

              {questionType === "MCQ" && (
                <List>
                  {answers.map((answer, index) => (
                    <ListItem key={index}>
                      <MDInput
                        type="text"
                        placeholder={`Answer ${index + 1}`}
                        value={answer.text}
                        onClick={() => handleOpenAnswerDialog(index)}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        sx={{ flex: 1, marginRight: 1 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={answer.isCorrect}
                            onChange={() => handleCorrectAnswerChange(index)}
                          />
                        }
                        label="Correct Answer"
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
              )}

              {questionType === "True/False" && (
                <RadioGroup>
                  <FormControlLabel
                    value="True"
                    control={<Radio />}
                    label="True"
                    checked={answers[0]?.text === "True"}
                    onChange={() => handleAnswerChange(0, "True")}
                  />
                  <FormControlLabel
                    value="False"
                    control={<Radio />}
                    label="False"
                    checked={answers[0]?.text === "False"}
                    onChange={() => handleAnswerChange(0, "False")}
                  />
                </RadioGroup>
              )}

              {questionType !== "True/False" && (
                <MDButton variant="outlined" color="success" onClick={handleAddAnswer}>
                  Add Answer
                </MDButton>
              )}
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
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-language-label">Question Language</InputLabel>
                <Select
                  labelId="select-language-label"
                  id="select-language"
                  value={questionLanguage}
                  onChange={(e) => setQuestionLanguage(e.target.value)}
                  input={<OutlinedInput label="Question Language" />}
                  sx={{
                    minWidth: 200,
                    height: "3rem",
                    ".MuiSelect-select": { padding: "0.45rem" },
                  }}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Gujarati">Gujarati</MenuItem>
                  <MenuItem value="Hindi">Hindi</MenuItem>
                </Select>
              </FormControl>
            </MDBox>

            <MDBox mb={3}>
              <FormControl component="fieldset" fullWidth>
                <MDTypography variant="h6" fontWeight="medium">
                  Status
                </MDTypography>
                <RadioGroup row value={status} onChange={(e) => setStatus(e.target.value)}>
                  <FormControlLabel value="Active" control={<Radio />} label="Active" />
                  <FormControlLabel value="Inactive" control={<Radio />} label="Inactive" />
                </RadioGroup>
              </FormControl>
            </MDBox>

            <MDBox mb={3}>
              <MDTypography variant="h6">Upload Media (Image/Video/Audio)</MDTypography>
              <input type="file" accept="image/*,video/*,audio/*" onChange={handleMediaChange} />
              {mediaFile && <MDTypography variant="body2">{mediaFile.name}</MDTypography>}
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
             onClose={() => setOpenSignatureDialog(false)}
             onConfirm={handleEditQuestion}
           />
      {/* Question Edit Dialog */}
       <TinyMCEEditorDialog
              open={openQuestionDialog}
              onClose={handleCloseQuestionDialog}
              title="Edit Question"
              content={questionText}
              onSave={handleSaveQuestion}
            />

      <TinyMCEEditorDialog
              open={openAnswerDialog}
              onClose={handleCloseAnswerDialog}
              title="Edit Answer"
              content={answers[currentAnswerIndex]?.text || ""}
              onSave={handleSaveAnswer}
            />
    </BasicLayout>
  );
}

export default EditQuestion;
