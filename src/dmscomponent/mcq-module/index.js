import React, { useEffect, useState } from 'react'
import CounterIndicator from './counterIndicator';
// import BasicLayout from 'layouts/authentication/components/BasicLayout';
// import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import MDButton from 'components/MDButton';
import QuestionSection from './questionSection';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {useCreateTrainingQuizQuery} from 'apilms/questionApi';
function MultiChoiceQuesionsSection() {

    const { data, isLoading, isError, refetch } = useCreateTrainingQuizQuery();
    console.log("-+-+-+-+---++--+-+-+-+-++--data of quiz",data);
    const [counter,setCounter]=useState(0);
    const [questions,setQuestions]=useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [answers, setAnswers] = useState({});
    const [pageCount,setPageCount]=useState(1)
    const handlePageChange = (event, page) => {
        setCurrentPage(page);
        console.log('Page changed to:', page); // You can handle your logic here
    };

    let timerLimit=600;
    const dummyResponse={
        "status": true,
        "message": "Quiz created successfully",
        "data": {
          "id": 28,
          "quiz_name": "test Quiz",
          "pass_criteria": "20.00",
          "quiz_time": 30,
          "total_marks": 5,
          "total_questions": 5,
          "quiz_type": "auto",
          "questions": [
            {
              "question_text": "What is the capital of France?",
              "question_type": "mcq",
              "options": [
                {
                  "text": "Paris",
                  "is_correct": true
                },
                {
                  "text": "London",
                  "is_correct": false
                },
                {
                  "text": "Rome",
                  "is_correct": false
                },
                {
                  "text": "Berlin",
                  "is_correct": false
                }
              ]
            },
            {
              "question_text": "True or False: The Earth is flat.",
              "question_type": "true_false",
              "options": [
                {
                  "text": "True",
                  "is_correct": false
                },
                {
                  "text": "False",
                  "is_correct": true
                }
              ]
            },
            {
                "question_text": "What is the capital of France?",
                "question_type": "mcq",
                "options": [
                  {
                    "text": "Paris",
                    "is_correct": true
                  },
                  {
                    "text": "London",
                    "is_correct": false
                  },
                  {
                    "text": "Rome",
                    "is_correct": false
                  },
                  {
                    "text": "Berlin",
                    "is_correct": false
                  }
                ]
              },
            // {
            //   "question_text": "Upload an image or video that explains Newton's laws.",
            //   "question_type": "image_video",
            //   "media_url": "https://example.com/media/file.mp4"
            // }
          ],
          "created_by": 2,
          "updated_by": null,
          "created_at": "2025-01-17T16:09:58.825168+05:30",
          "updated_at": "2025-01-17T16:09:58.864874+05:30",
          "status": true
        }
    }
      useEffect(()=>{
        setQuestions(dummyResponse?.data?.questions)
        setPageCount(dummyResponse?.data?.questions?.length)
        console.log(pageCount)
      },[])

    // Styles 
    const mcqSection={
        width:'900px',
        marginLeft:"400px",
        marginTop:"100px",
        backgroundColor:"white",
        padding:'20px',
        borderRadius:'10px',
        display:'flex',
        flexDirection:'column',
        gap:'10px'
    }
    const topSection={
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        itemCenter:'center'
    }
    const paginationStyles={
        display:'flex',
        justifyContent:'center',
        itemCenter:'center',
        marginTop:'20px',
        marginBottom:'20px'
    }
    // Styles End
  return (
            <div style={mcqSection}>
                <div style={topSection}>
                    <CounterIndicator counter={counter} setCounter={setCounter} timerLimit={timerLimit}/>
                    <MDButton
                        variant="contained"
                        color="primary"
                        onClick={() => {}}
                        sx={{ height:'30px' }}
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
                    <Stack        
                    spacing={2}>
                        <Pagination onChange={handlePageChange} count={pageCount} page={currentPage} variant="outlined" size="large" color="primary" shape="rounded" />
                    </Stack>
                </div>
            </div>
  )
}

export default MultiChoiceQuesionsSection