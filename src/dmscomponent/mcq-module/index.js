import React, { useEffect, useState } from 'react';
import CounterIndicator from './counterIndicator';
import MDButton from 'components/MDButton';
import QuestionSection from './questionSection';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import { useCreateTrainingQuizQuery } from 'apilms/questionApi';
import { useLocation, useNavigate } from 'react-router-dom';

function MultiChoiceQuestionsSection() {
      const navigate = useNavigate(); 
      const location = useLocation();
      const id = location?.state?.rowData || null;
      console.log("ID=>",id)
        const data2 = {
        status: true,
        message: "Training question list fetched successfully",
        data: [
            {
                id: 15,
                training: 3,
                question_type: "MCQ",
                question_text: "Where is Rahane from?",
                options: "Mumbai,aficea,nigeria,Nepal,Sri Lanka,UK",
                correct_answer: "Mumbai",
                marks: 5,
                status: true,
                question_created_at: "2025-01-22T22:14:52.827899+05:30",
                question_updated_at: "2025-01-22T22:14:52.827899+05:30",
                created_by: 2,
                updated_by: null,
                image_file_url: null,
                audio_file_url: null,
                video_file_url: null,
            },
            {
                id: 14,
                training: 3,
                question_type: "Fill in the blank",
                question_text: "Xyz comes between what?.(Give answer in DD Format)",
                options: "",
                correct_answer: "mma",
                marks: 5,
                status: true,
                question_created_at: "2025-01-22T22:12:43.882912+05:30",
                question_updated_at: "2025-01-22T22:12:43.882912+05:30",
                created_by: 2,
                updated_by: null,
                image_file_url: null,
                audio_file_url: null,
                video_file_url: null,
            },
            {
                id: 13,
                training: 3,
                question_type: "True/False",
                question_text: "Is Water wet?",
                options: "True,False",
                correct_answer: "True",
                marks: 5,
                status: true,
                question_created_at: "2025-01-22T22:11:42.086805+05:30",
                question_updated_at: "2025-01-22T22:11:42.086805+05:30",
                created_by: 2,
                updated_by: null,
                image_file_url: null,
                audio_file_url: null,
                video_file_url: null,
            },
            {
                id: 12,
                training: 3,
                question_type: "MCQ",
                question_text: "Question&nbsp; 1",
                options: "abc,def,ghi,uio",
                correct_answer: "abc",
                marks: 5,
                status: true,
                question_created_at: "2025-01-22T22:10:15.015243+05:30",
                question_updated_at: "2025-01-22T22:10:15.015243+05:30",
                created_by: 2,
                updated_by: null,
                image_file_url: null,
                audio_file_url: null,
                video_file_url: null,
            },
            {
              id: 17,
              training: 3,
              question_type: "Fill in the blank",
              question_text: "Xyz comes between what?",
              options: "",
              correct_answer: "mewto",
              marks: 5,
              status: true,
              question_created_at: "2025-01-22T22:12:43.882912+05:30",
              question_updated_at: "2025-01-22T22:12:43.882912+05:30",
              created_by: 2,
              updated_by: null,
              image_file_url: null,
              audio_file_url: null,
              video_file_url: null,
          },
        ],
    };  
        const data={
            "status": true,
            "message": "Training question list fetched successfully",
            "data": [   
                {
                    "id": 19,
                    "training": 3,
                    "question_type": "MCQ",
                    "question_text": "What nation is this?",
                    "options": "test 1,test 2,test 3",
                    "correct_answer": "test 2",
                    "marks": 5,
                    "status": true,
                    "question_created_at": "2025-01-24T14:31:49.714574+05:30",
                    "question_updated_at": "2025-01-24T14:31:49.714574+05:30",
                    "created_by": 2,
                    "updated_by": null,
                    "selected_file_type": null,
                    "selected_file": null
                },
                {
                    "id": 18,
                    "training": 3,
                    "question_type": "MCQ",
                    "question_text": "What is this country?",
                    "options": "India,Sri Lanka,Bangladesh",
                    "correct_answer": "",
                    "marks": 5,
                    "status": true,
                    "question_created_at": "2025-01-24T14:28:17.662609+05:30",
                    "question_updated_at": "2025-01-24T14:28:17.662609+05:30",
                    "created_by": 2,
                    "updated_by": null,
                    "selected_file_type": null,
                    "selected_file": null
                },
                {
                    "id": 17,
                    "training": 3,
                    "question_type": "MCQ",
                    "question_text": "Which animal is this?",
                    "options": "Elephant,Tiger,Cheetah,Jaguar",
                    "correct_answer": "Jaguar",
                    "marks": 5,
                    "status": true,
                    "question_created_at": "2025-01-24T14:20:21.358104+05:30",
                    "question_updated_at": "2025-01-24T14:20:21.358104+05:30",
                    "created_by": 2,
                    "updated_by": null,
                    "selected_file_type": null,
                    "selected_file": null
                },
                {
                    "id": 16,
                    "training": 3,
                    "question_type": "MCQ",
                    "question_text": "Which country does Neymar play for?",
                    "options": "India,Nepal,Pakistan,Brazil",
                    "correct_answer": "Brazil",
                    "marks": 3,
                    "status": true,
                    "question_created_at": "2025-01-23T10:27:03.285003+05:30",
                    "question_updated_at": "2025-01-23T10:27:03.285003+05:30",
                    "created_by": 2,
                    "updated_by": null,
                    "selected_file_type": null,
                    "selected_file": null
                },
                {
                    "id": 15,
                    "training": 3,
                    "question_type": "MCQ",
                    "question_text": "Where is Rahane from?",
                    "options": "Mumbai,aficea,nigeria,Nepal,Sri Lanka,UK",
                    "correct_answer": "Mumbai",
                    "marks": 5,
                    "status": true,
                    "question_created_at": "2025-01-22T22:14:52.827899+05:30",
                    "question_updated_at": "2025-01-22T22:14:52.827899+05:30",
                    "created_by": 2,
                    "updated_by": null,
                    "selected_file_type": null,
                    "selected_file": null
                },
                {
                    "id": 14,
                    "training": 3,
                    "question_type": "Fill in the blank",
                    "question_text": "Xyz comes between what?",
                    "options": "",
                    "correct_answer": "mma",
                    "marks": 5,
                    "status": true,
                    "question_created_at": "2025-01-22T22:12:43.882912+05:30",
                    "question_updated_at": "2025-01-22T22:12:43.882912+05:30",
                    "created_by": 2,
                    "updated_by": null,
                    "selected_file_type": null,
                    "selected_file": null
                },
                {
                    "id": 13,
                    "training": 3,
                    "question_type": "True/False",
                    "question_text": "Is Water wet",
                    "options": "True,False",
                    "correct_answer": "True",
                    "marks": 5,
                    "status": true,
                    "question_created_at": "2025-01-22T22:11:42.086805+05:30",
                    "question_updated_at": "2025-01-22T22:11:42.086805+05:30",
                    "created_by": 2,
                    "updated_by": null,
                    "selected_file_type": null,
                    "selected_file": null
                },
                {
                    "id": 12,
                    "training": 3,
                    "question_type": "MCQ",
                    "question_text": "Question&nbsp; 1",
                    "options": "abc,def,ghi,uio",
                    "correct_answer": "",
                    "marks": 5,
                    "status": true,
                    "question_created_at": "2025-01-22T22:10:15.015243+05:30",
                    "question_updated_at": "2025-01-22T22:10:15.015243+05:30",
                    "created_by": 2,
                    "updated_by": null,
                    "selected_file_type": null,
                    "selected_file": null
                }
            ]
        }

    const { data:newData, isLoading, isError, refetch } = useCreateTrainingQuizQuery();
    console.log(newData)
    const [counter, setCounter] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [answers, setAnswers] = useState({});
    const [correctAnswers,setCorrectAnswers] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [timerLimit, setTimerLimit] = useState(0);

    // Modal Setup
    const [openModal, setOpenModal] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    // React Router's navigation hook

    // Function to handle modal close and redirect
    // console.log(answers)
    useEffect(() => {
        console.log("API Response: ", data); // Log to check the API response
        if (data && data.data) {
            setQuestions(data?.data); // Set the questions array
            setPageCount(data?.data?.length); // Set the total number of questions
            setTimerLimit(10*60); // Set a default timer limit (e.g., 60 seconds)
            // const quizAnswers= data?.data?.map((item=>item?.correct_answer))
            // setCorrectAnswers(quizAnswers)
            const initialAnswers = data?.data?.reduce((acc, item) => {
              acc[item.id] = item.correct_answer || '';
              return acc;
          }, {});
          setCorrectAnswers(initialAnswers)
        } else {
            console.log("No quiz data found.");
        }
    }, []);
    // console.log(answers )
    // console.log("Correct Answers",correctAnswers)
    // console.log("Selected Answers",answers)

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes} minutes, ${secs} seconds`;
  };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    };

    // const handleSubmit = () => {
    //     console.log("Submit answers", answers);
    // };

    const handleSubmit1 = () => {
      console.log("Submit answers", answers);
      console.log("Correct answers", correctAnswers);
  
      // Initialize variables for total marks and marks obtained
      let totalMarks = 0;
      let marksObtained = 0;
  
      // Iterate through the `questions` array
      questions.forEach((question) => {
          totalMarks += question.marks; // Accumulate total marks
          const userAnswer = answers[question.id]; // User's answer for the question
          const correctAnswer = correctAnswers[question.id]; // Correct answer for the question
  
          if (userAnswer === correctAnswer) {
              marksObtained += question.marks; // Add marks if the answer is correct
          }
      });

    //   const handleSubmit = () => {
    // console.log("Submit answers", answers);
    // console.log("Correct answers", correctAnswers);

    // let totalMarks = 0;
    // let marksObtained = 0;

    // questions.forEach((question) => {
    //     totalMarks += question.marks;
    //     const userAnswer = answers[question.id];
    //     const correctAnswer = correctAnswers[question.id];

    //     if (userAnswer === correctAnswer) {
    //         marksObtained += question.marks;
    //     }
    // });

    // const timeTaken = counter;
    // const message = `You scored ${marksObtained} out of ${totalMarks} marks.\nTime taken: ${formatTime(timeTaken)}`;
    // setResultMessage(message);
    // setOpenModal(true);
    //   };
      

    
  
      // Log the results
      // console.log("Total Marks:", totalMarks);
      // console.log("Marks Obtained:", marksObtained);
      // const timeTaken = counter;
      // alert(`You scored ${marksObtained} out of ${totalMarks} marks
      //   You scored ${marksObtained} out of ${totalMarks} marks.\nTime taken: ${formatTime(timeTaken)}
      //   `);
      // alert(`You scored ${marksObtained} out of ${totalMarks} marks.\nTime taken: ${formatTime(timeTaken)}`);
  };
  const handleSubmit = () => {
    console.log("Submit answers", answers);
    console.log("Correct answers", correctAnswers);

    let totalMarks = 0;
    let marksObtained = 0;

    questions.forEach((question) => {
        totalMarks += question.marks;
        // const userAnswer = answers[question.id];
        // const correctAnswer = correctAnswers[question.id];

        const userAnswer = (answers[question.id] || '').toLowerCase();
        const correctAnswer = (correctAnswers[question.id] || '').toLowerCase();


        if (userAnswer === correctAnswer) {
            marksObtained += question.marks;
        }
    });

    const timeTaken = counter;
    const message = `You scored ${marksObtained} out of ${totalMarks} marks.\n Time taken: ${formatTime(timeTaken)}`;
    setResultMessage(message);
    setOpenModal(true);
};
const handleModalClose = () => {
  setOpenModal(false);
  // setAnswers({});
  // setCounter(0); // Reset timer
  navigate('/trainingListing'); // Redirect to /questions
};
    // Styles
    const mcqSection = {
        width: '900px',
        marginLeft: '400px',
        marginTop: '100px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    };

    const topSection = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const paginationStyles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px',
        marginBottom: '20px',
    };

    return (
        <div style={mcqSection}>
            <div style={topSection}>
                <CounterIndicator counter={counter} setCounter={setCounter} timerLimit={timerLimit} />
                <MDButton
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ height: '30px' }}
                >
                    Submit
                </MDButton>
            </div>
            <div>
                <QuestionSection
                    question={questions[currentPage - 1]}
                    questionIndex={currentPage}
                    pageCount={pageCount}
                    onAnswerChange={handleAnswerChange}
                    answers={answers}
                />

            </div>
            <div style={paginationStyles}>
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
            </div>
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
        </div>
    );
}

export default MultiChoiceQuestionsSection;