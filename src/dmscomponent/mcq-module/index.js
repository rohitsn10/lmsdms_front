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
import { useLocation, useNavigate } from "react-router-dom";
import { useGetTrainingQuizzesQuery } from "apilms/quizapi";
import { useAttemptQuizMutation } from "apilms/quizapi";
import { useAuth } from "hooks/use-auth";

function MultiChoiceQuestionsSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.rowData;
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
  // New state for confirmation modal
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  
  // Prevent browser back navigation
  // useEffect(() => {
  //   if (hasSubmitted) return; // Don't block navigation after submission
    
  //   // Define the function to handle back/forward navigation
  //   const blockNavigation = (e) => {
  //     // Push the current state again to prevent navigation
  //     window.history.pushState(null, null, window.location.href);
  //     // Show confirmation dialog
  //     // setOpenConfirmModal(true);
  //     // Cancel the event
  //     e.preventDefault();
  //     // Chrome requires returnValue to be set for beforeunload
  //     if (e.type === 'beforeunload') {
  //       e.returnValue = '';
  //     }
  //     return '';
  //   };

  //   // Push state initially to ensure there's a history entry to go back to
  //   window.history.pushState(null, null, window.location.href);
    
  //   // Listen for attempts to navigate away
  //   window.addEventListener('popstate', blockNavigation);
  //   window.addEventListener('beforeunload', blockNavigation);
    
  //   // Clean up event listeners on component unmount
  //   return () => {
  //     window.removeEventListener('popstate', blockNavigation);
  //     window.removeEventListener('beforeunload', blockNavigation);
  //   };
  // }, [hasSubmitted]);
  // useEffect(() => {
  //   if (hasSubmitted) return; // Don't block navigation after submission
  
  //   let isModalOpen = false; // Track modal state
  
  //   const blockNavigation = (e) => {
  //     if (isModalOpen) return; // Prevent multiple pop-ups
  
  //     // Push the current state again to prevent navigation
  //     window.history.pushState(null, null, window.location.href);
      
  //     // Show confirmation dialog only once
  //     isModalOpen = true;
  //     setOpenConfirmModal(true);
  
  //     // Prevent default behavior
  //     e.preventDefault();
  //     if (e.type === 'beforeunload') e.returnValue = '';
  
  //     return '';
  //   };
  
  //   // Push initial state to block navigation
  //   window.history.pushState(null, null, window.location.href);
  
  //   window.addEventListener('popstate', blockNavigation);
  //   window.addEventListener('beforeunload', blockNavigation);
  
  //   return () => {
  //     window.removeEventListener('popstate', blockNavigation);
  //     window.removeEventListener('beforeunload', blockNavigation);
  //   };
  // }, [hasSubmitted]);
  // useEffect(() => {
  //   if (hasSubmitted) return; // Allow navigation after submission
  
  //   let isModalOpen = false; // Track modal state
  
  //   const blockNavigation = (e) => {
  //     // Prevent multiple pop-ups
  //     if (!isModalOpen) {
  //       isModalOpen = true;
  //       setOpenConfirmModal(true);
  //     }
  
  //     // Push state again to keep the user on the same page
  //     window.history.pushState(null, null, window.location.href);
  
  //     // Prevent default behavior
  //     e.preventDefault();
  //     if (e.type === 'beforeunload') e.returnValue = '';
  
  //     return '';
  //   };
  
  //   // Continuously push state to disable back navigation
  //   const disableBack = () => {
  //     window.history.pushState(null, null, window.location.href);
  //   };
  
  //   // Initial state push
  //   disableBack();
  
  //   // Listen for back navigation attempts
  //   window.addEventListener('popstate', blockNavigation);
  //   window.addEventListener('beforeunload', blockNavigation);
  
  //   // Continuously push state to lock the user in the quiz
  //   const interval = setInterval(disableBack, 500);
  
  //   return () => {
  //     clearInterval(interval); // Stop pushing state when the component unmounts
  //     window.removeEventListener('popstate', blockNavigation);
  //     window.removeEventListener('beforeunload', blockNavigation);
  //   };
  // }, [hasSubmitted]);
  // useEffect(() => {
  //   if (hasSubmitted) return; // Allow navigation only after submission
  
  //   let isModalOpen = false; // Track modal state
  
  //   const blockNavigation = (e) => {
  //     if (!isModalOpen) {
  //       isModalOpen = true;
  //       setOpenConfirmModal(true);
  //     }
  
  //     // Prevent back navigation by pushing the same state repeatedly
  //     window.history.pushState(null, null, window.location.href);
  
  //     e.preventDefault();
  //     if (e.type === 'beforeunload') e.returnValue = '';
  //     return '';
  //   };
  
  //   const disableBack = () => {
  //     window.history.pushState(null, null, window.location.href);
  //   };
  
  //   // Prevent back navigation immediately
  //   disableBack();
  
  //   // Listen for back button attempts
  //   window.addEventListener('popstate', blockNavigation);
  //   window.addEventListener('beforeunload', blockNavigation);
  
  //   // Force the state push continuously to lock user in
  //   const interval = setInterval(disableBack, 100);
  
  //   return () => {
  //     clearInterval(interval);
  //     window.removeEventListener('popstate', blockNavigation);
  //     window.removeEventListener('beforeunload', blockNavigation);
  //   };
  // }, [hasSubmitted]);

  // Make sure navigation is disabled when using keyboard shortcuts too
  // useEffect(() => {
  //   if (hasSubmitted) return;
    
  //   const handleKeyDown = (e) => {
  //     // Block Alt+Left (back) and Alt+Right (forward) keyboard shortcuts
  //     if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
  //       e.preventDefault();
  //       // setOpenConfirmModal(true);
  //     }
  //   };
    
  //   window.addEventListener('keydown', handleKeyDown);
    
  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, [hasSubmitted]);
  useEffect(() => {
    // Prevent back navigation by pushing the same state repeatedly
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
    // Block keyboard shortcuts (Alt + Left/Right, Backspace)
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
  const handleConfirmExit = () => {
    setOpenConfirmModal(false);
    // Remove the event listeners before navigating to prevent blocking the navigation
    window.removeEventListener('popstate', () => {});
    window.removeEventListener('beforeunload', () => {});
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
            {/* <Button onClick={handleConfirmExit} color="error">
              Exit Quiz
            </Button> */}
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default MultiChoiceQuestionsSection;