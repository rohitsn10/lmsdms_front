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
import CircularProgress from '@mui/material/CircularProgress';

import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchTrainingWiseQuestionsQuery } from 'apilms/questionApi';

function MultiChoiceQuestionsSection() {
    const navigate = useNavigate(); 
    const location = useLocation();
    const id = location?.state?.rowData;

    const { data, isLoading, isError } = useFetchTrainingWiseQuestionsQuery(id, {
        skip: !id // Skip the query if id is not available
    });

    const [counter, setCounter] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [answers, setAnswers] = useState({});
    const [correctAnswers, setCorrectAnswers] = useState({});
    const [pageCount, setPageCount] = useState(1);
    const [timerLimit, setTimerLimit] = useState(10 * 60);
    const [openModal, setOpenModal] = useState(false);
    const [resultMessage, setResultMessage] = useState('');

    useEffect(() => {
        if (data?.data?.length > 0) {
            setQuestions(data.data);
            setPageCount(data.data.length);
            
            const initialCorrectAnswers = data.data.reduce((acc, item) => {
                acc[item.id] = (item.correct_answer || '').toLowerCase();
                return acc;
            }, {});
            setCorrectAnswers(initialCorrectAnswers);
        }
    }, [data]);

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

    const handleSubmit = () => {
        let totalMarks = 0;
        let marksObtained = 0;

        questions.forEach((question) => {
            totalMarks += question.marks;
            const userAnswer = (answers[question.id] || '').toLowerCase();
            const correctAnswer = correctAnswers[question.id] || '';

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
        navigate('/trainingListing');
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

    // Loading and error states
    if (isLoading) {
        return (
            <div style={{...mcqSection, justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress />
            </div>
        );
    }

    if (isError || !id || questions.length === 0) {
        return (
            <div style={{...mcqSection, justifyContent: 'center', alignItems: 'center'}}>
                <p>No questions available or an error occurred.</p>
            </div>
        );
    }

    return (
        <div style={mcqSection}>
            <div style={topSection}>
                <CounterIndicator 
                    counter={counter} 
                    setCounter={setCounter} 
                    timerLimit={timerLimit} 
                />
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
                {questions[currentPage - 1] && (
                    <QuestionSection
                        question={questions[currentPage - 1]}
                        questionIndex={currentPage}
                        pageCount={pageCount}
                        onAnswerChange={handleAnswerChange}
                        answers={answers}
                    />
                )}
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