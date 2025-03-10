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
  Container 
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetTrainingQuizzesQuery } from "apilms/quizapi";
import { useAttemptQuizMutation } from "apilms/quizapi";
import { useAuth } from "hooks/use-auth";

function MultiChoiceQuestionsSection() {
  const navigate = useNavigate();
  const location = useLocation();
    const { trainingQuizId } = useParams();
  // const id = location?.state?.rowData;
  const id = trainingQuizId;
  const { user } = useAuth();
  const { data: questionsData, isLoading, isError } = useGetTrainingQuizzesQuery(id, {
    skip: !id,
  });
  const quiz_id = questionsData?.data[0]?.id || 0;
  const [attemptQuiz] = useAttemptQuizMutation();
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [pageCount, setPageCount] = useState(1);
  const [counter, setCounter] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  
  // This is the most important part - disabling the back button
  useEffect(() => {
    // Force replace current history entry
    window.history.replaceState(null, "", window.location.pathname);

    // Push additional state to create new history entry
    window.history.pushState(null, "", window.location.pathname);
    window.history.pushState(null, "", window.location.pathname);
    
    // Function to handle popstate (when back/forward buttons are clicked)
    const blockNavigation = (e) => {
      // This will stop the navigation from happening
      window.history.pushState(null, "", window.location.pathname);
      
      // Push one more state to ensure we have enough history entries
      window.history.pushState(null, "", window.location.pathname);
    };
    
    // Block Ctrl+W, Alt+F4, and other ways to close the window/tab
    const blockBeforeUnload = (e) => {
      if (!hasSubmitted) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };
    
    // Block keyboard shortcuts
    const blockKeys = (e) => {
      // Block Alt+Left, Alt+Right (browser navigation keys)
      if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Block Backspace outside of input fields (which triggers back navigation)
      if (e.key === "Backspace" && 
          e.target.tagName !== "INPUT" && 
          e.target.tagName !== "TEXTAREA" && 
          !e.target.isContentEditable) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    
    // Register all event listeners
    window.addEventListener("popstate", blockNavigation);
    window.addEventListener("beforeunload", blockBeforeUnload);
    window.addEventListener("keydown", blockKeys, true);
    
    // Periodically push state to ensure back button is always disabled
    const intervalId = setInterval(() => {
      window.history.pushState(null, "", window.location.pathname);
    }, 300);
    
    return () => {
      // Clean up all event listeners when component unmounts
      window.removeEventListener("popstate", blockNavigation);
      window.removeEventListener("beforeunload", blockBeforeUnload);
      window.removeEventListener("keydown", blockKeys, true);
      clearInterval(intervalId);
    };
  }, [hasSubmitted]);

  const handleConfirmExit = () => {
    setOpenConfirmModal(false);
    navigate("/trainingListing", { replace: true });
  };

  const handleCancelExit = () => {
    setOpenConfirmModal(false);
  };

  useEffect(() => {
    if (questionsData?.data?.[0]) {
      const quizData = questionsData.data[0];
      setQuestions(quizData.questions || []);
      setPageCount(quizData.questions?.length || 0);
      setCounter(quizData.quiz_time * 60);
      
      const initialCorrectAnswers = (quizData.questions || []).reduce((acc, item) => {
        acc[item.id] = (item.correct_answer || "").toLowerCase();
        return acc;
      }, {});
      setCorrectAnswers(initialCorrectAnswers);
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
        correct_answer: correctAnswer || "none"
      });

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

  const handleSubmit = async() => {
    if (hasSubmitted) return;

    const results = calculateResults();
    const passCriteria = parseFloat(questionsData.data[0].pass_criteria);
    const passKey = results.marksObtained >= passCriteria;
    const message = `You scored ${results.marksObtained} out of ${results.totalMarks} marks.\nTime taken: ${formatTime(results.timeTaken)}`;

    const quizPayload = {
      document_id: id,
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
    setResultMessage(message);
    setOpenModal(true);
    setHasSubmitted(true);

    try {
      await attemptQuiz(quizPayload).unwrap();
      console.log("Quiz submitted successfully");
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    navigate("/trainingListing", { replace: true });
  };

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
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
        minHeight="100vh"
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

        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2.5 }}>
          <Stack spacing={2}>
            <Pagination
              onChange={handlePageChange}
              count={pageCount}
              page={currentPage}
              variant="outlined"
              size="large"
              color="primary"
              shape="rounded"
            />
          </Stack>
        </Box>

        {/* Results Modal */}
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

        {/* Exit Confirmation Modal */}
        <Dialog open={openConfirmModal} onClose={handleCancelExit}>
          <DialogTitle>Are you sure you want to exit?</DialogTitle>
          <DialogContent>
            <p>Your progress will be lost and your answers won&apos;t be saved.</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelExit} color="primary">
              Continue Quiz
            </Button>
            <Button onClick={handleConfirmExit} color="error">
              Exit Quiz
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

// Add this to ensure back button is disabled immediately
// when the file is loaded, before the component mounts
if (typeof window !== 'undefined') {
  window.history.pushState(null, "", window.location.pathname);
  window.history.pushState(null, "", window.location.pathname);
  window.addEventListener("popstate", function() {
    window.history.pushState(null, "", window.location.pathname);
  });
}

export default MultiChoiceQuestionsSection;