import React, { useEffect, useState } from "react";
import CounterIndicator from "./counterIndicator";
import MDButton from "components/MDButton";
import QuestionSection from "./questionSection";
import {
  Pagination,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Container,
  IconButton
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAttemptQuizMutation } from "apilms/quizapi";
import { useAuth } from "hooks/use-auth";
import { useClassroomQuizGetQuery } from "apilms/classtestApi";
import { useClassroomStartAttemptQuizMutation } from "apilms/classtestApi";
import { useClassroomAttemptQuizMutation } from "apilms/classtestApi";

function ClassMultiChoiceQuestionsSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [startAttemptQuiz] = useClassroomStartAttemptQuizMutation();
  const { classroomQuizId } = useParams();
  const id = classroomQuizId;
  const { user } = useAuth();
  const { data: questionsData, isLoading, isError } = useClassroomQuizGetQuery(id, { skip: !id });
  // useClassroomStartAttemptQuizMutation
  // console.log("Questions Data::::",questionsData)
  // const [attemptQuiz] = useAttemptQuizMutation();
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [pageCount, setPageCount] = useState(1);
  const [counter, setCounter] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
    const [attemptQuiz] = useClassroomAttemptQuizMutation();
    useEffect(() => {
      if (questionsData?.data?.[0]?.id) {
        const quizId = questionsData.data[0].id;
        
        // Call the mutation when quiz starts
        startAttemptQuiz({ classroom_id: id, quiz_id: quizId })
          .then(() => console.log("Quiz attempt started successfully"))
          .catch((error) => console.error("Error starting quiz attempt:", error));
      }
    }, [questionsData]);
  // Prevent Back Navigation (Browser Back Button & Keyboard Shortcuts)
  useEffect(() => {
    const preventNavigation = () => {
      window.history.pushState(null, null, window.location.href);
    };

    preventNavigation();
    window.addEventListener("popstate", preventNavigation);

    return () => {
      window.removeEventListener("popstate", preventNavigation);
    };
  }, []);

  useEffect(() => {
    const blockKeys = (e) => {
      if ((e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) || e.key === "Backspace") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", blockKeys);

    return () => {
      window.removeEventListener("keydown", blockKeys);
    };
  }, []);

  useEffect(() => {
    if (questionsData?.data?.[0]) {
      const quizData = questionsData.data[0];

      const shuffleArray = (array) => {
        let shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };
      const shuffledQuestions = shuffleArray(quizData.questions || []);

      // setQuestions(quizData.questions || []);
      // setPageCount(quizData.questions?.length || 0);
      setQuestions(shuffledQuestions);
      setPageCount(shuffledQuestions.length);
      setCounter(quizData.quiz_time * 60);
      
      const initialCorrectAnswers = shuffledQuestions.reduce((acc, item) => {
        acc[item.id] = (item.correct_answer || "").toLowerCase();
        return acc;
      }, {});
      setCorrectAnswers(initialCorrectAnswers);
      // const initialCorrectAnswers = (quizData.questions || []).reduce((acc, item) => {
      //   acc[item.id] = (item.correct_answer || "").toLowerCase();
      //   return acc;
      // }, {});
      // setCorrectAnswers(initialCorrectAnswers);
    }
  }, [questionsData]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} minutes, ${secs} seconds`;
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleAnswerChange = (questionId, answer) => {
    if (!hasSubmitted) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: answer.toLowerCase(),
      }));
    }
  };

  const calculateResults = () => {
    let totalMarks = 0;
    let marksObtained = 0;
    const userResponseList = [];
    const incorrectList = [];
    const correctList = [];

    questions.forEach((question) => {
      totalMarks += question.marks;
      const userAnswer = (answers[question.id] || "").toLowerCase();
      const correctAnswer = correctAnswers[question.id] || "";

      userResponseList.push({
        question_id: question.id,
        question_text: question.question_text,
        user_answer: userAnswer || "No Answer",
      });

      // if (userAnswer === correctAnswer) {
      //   marksObtained += question.marks;
      // }
      if (userAnswer === correctAnswer) {
        marksObtained += question.marks;
        correctList.push({
          question_id: question.id,
          question_text: question.question_text,
          user_answer: userAnswer || "No Answer",
          correct_answer: correctAnswer || "none"
        })
      } else {
        incorrectList.push({
          question_id: question.id,
          question_text: question.question_text,
          user_answer: userAnswer || "No Answer",
          correct_answer: correctAnswer || "none"
        })
      }
    });

    return {
      totalMarks,
      marksObtained,
      userResponseList,
      timeTaken: questionsData.data[0].quiz_time * 60 - counter,
      incorrectList,
      correctList
    };
  };

  const handleSubmit = async () => {
    if (hasSubmitted) return;

    const results = calculateResults();
    const passCriteria = parseFloat(questionsData.data[0].pass_criteria);
    const passKey = results.marksObtained >= passCriteria;
    const message = `You scored ${results.marksObtained} out of ${results.totalMarks} marks.\nTime taken: ${formatTime(results.timeTaken)}`;
    // const quiz_id=questionsData?.id;
    const quiz_id = questionsData?.data?.[0]?.id; 

    setResultMessage(message);
    setOpenModal(true);
    setHasSubmitted(true);

    const quizPayload = {
      classroom_id: id,
      quiz_id: quiz_id,
      user_id: user?.id,
      questions: results.userResponseList,
      obtain_marks: results.marksObtained,
      total_marks: results.totalMarks,
      total_taken_time: results.timeTaken,
      is_pass: passKey,
      incorrect_questions: results.incorrectList,
      correct_questions: results.correctList
    };
    try {
      await attemptQuiz(quizPayload).unwrap();
      console.log("Quiz submitted successfully");
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    navigate("/class-room");
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !id || questions.length === 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        sx={{
          backgroundColor: "white !important",
          width: "300px",
          margin: "auto",
          padding: "30px",
          marginTop: "200px",
          borderRadius: "10px"
        }}
      >
        <p>No questions available or an error occurred.</p>
      </Box>
    );
  }

  const isQuizComplete = Object.keys(answers).length === questions.length;

  return (
    <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>
      <Box 
        sx={{ 
          bgcolor: 'background.paper',
          borderRadius: 1,
          p: 2.5,
          boxShadow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {/* Back Button */}
        {/* <IconButton onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
          <ArrowBackIcon />
        </IconButton> */}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CounterIndicator
            counter={counter}
            setCounter={setCounter}
            timerLimit={questionsData.data[0].quiz_time * 60}
            handleSubmit={handleSubmit}
          />
          <MDButton
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ height: "30px" }}
            disabled={!isQuizComplete || hasSubmitted}
          >
            {hasSubmitted ? 'Submitted' : 'Submit'}
          </MDButton>
        </Box>

        {/* Question Section */}
        {questions[currentPage - 1] && (
          <QuestionSection
            question={questions[currentPage - 1]}
            questionIndex={currentPage}
            pageCount={pageCount}
            onAnswerChange={handleAnswerChange}
            answers={answers}
            disabled={hasSubmitted}
          />
        )}

        {/* Pagination */}
        <Stack spacing={2} alignItems="center" mt={2}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>

        {/* Result Modal */}
        <Dialog open={openModal} onClose={handleModalClose}>
          <DialogTitle>Quiz Results</DialogTitle>
          <DialogContent>
            <p>{resultMessage}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default ClassMultiChoiceQuestionsSection;
