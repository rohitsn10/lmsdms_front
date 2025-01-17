import React, { useEffect, useState } from 'react'
import CounterIndicator from './counterIndicator';
// import BasicLayout from 'layouts/authentication/components/BasicLayout';
// import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import MDButton from 'components/MDButton';
import QuestionSection from './questionSection';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function MultiChoiceQuesionsSection() {

    const [counter,setCounter]=useState(0);
    const [questions,setQuestions]=useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [answers, setAnswers] = useState({});
    const handlePageChange = (event, page) => {
        setCurrentPage(page);
        console.log('Page changed to:', page); // You can handle your logic here
    };

    let timerLimit=600;

    // Styles Start
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
                    <QuestionSection/>
                </div>
                <div style={paginationStyles}>
                    <Stack        
                    spacing={2}>
                        <Pagination onChange={handlePageChange} count={10} page={currentPage} variant="outlined" size="large" color="primary" shape="rounded" />
                    </Stack>
                </div>
            </div>
  )
}

export default MultiChoiceQuesionsSection