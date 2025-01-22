import React, { useEffect, useState } from 'react';
import CounterIndicator from './counterIndicator';
import MDButton from 'components/MDButton';
import QuestionSection from './questionSection';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useCreateTrainingQuizQuery } from 'apilms/questionApi';

function MultiChoiceQuesionsSection() {
    const { data, isLoading, isError, refetch } = useCreateTrainingQuizQuery();
    const [counter, setCounter] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [answers, setAnswers] = useState({});
    const [pageCount, setPageCount] = useState(1);
    const [timerLimit, setTimerLimit] = useState(0);
    console.log("------------------",questions);
    
    useEffect(() => {
      console.log("API Response: ", data); // Log to check the API response
      if (data && data.length > 0) {
          const quizData = data[0]; // Assuming the first quiz in the list is the active one
          console.log("Quiz Data: ", quizData);
          setQuestions(quizData.questions);
          setPageCount(quizData.total_questions);
          setTimerLimit(quizData.quiz_time * 60); // Convert quiz time from minutes to seconds
      } else {
          console.log("No quiz data found.");
      }
  }, [data]);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleSubmit = () => {
        // Handle submission logic here, e.g., submit answers
        console.log("Submit answers", answers);
    };

    // Styles
    const mcqSection = {
        width: '900px',
        marginLeft: "400px",
        marginTop: "100px",
        backgroundColor: "white",
        padding: '20px',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    };

    const topSection = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        itemCenter: 'center'
    };

    const paginationStyles = {
        display: 'flex',
        justifyContent: 'center',
        itemCenter: 'center',
        marginTop: '20px',
        marginBottom: '20px'
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
        </div>
    );
}

export default MultiChoiceQuesionsSection;
