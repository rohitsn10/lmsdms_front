import { Padding } from '@mui/icons-material'
import React from 'react'

function QuestionSection() {
    const dummy={
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
              "question": 5,
              "marks": 1,
              "question_text": "What is the object shown in the image?"
            },
            {
              "question": 2,
              "marks": 1,
              "question_text": "What is the object shown in the image?"
            },
            {
              "question": 4,
              "marks": 1,
              "question_text": "What is the object shown in the image?"
            },
            {
              "question": 1,
              "marks": 1,
              "question_text": "What is the object shown in the image?"
            },
            {
              "question": 3,
              "marks": 1,
              "question_text": "What is the object shown in the image?"
            }
          ],
          "created_by": 2,
          "updated_by": null,
          "created_at": "2025-01-17T16:09:58.825168+05:30",
          "updated_at": "2025-01-17T16:09:58.864874+05:30",
          "status": true
        }
      }

    const options=[
        "Sion","Mumbai","Jaipur","Solapur"
    ]
    const optionDef=['A','B','C','D']
    // Styles
   const questionPos={
    fontSize:'19px',
    color:'#gray',
    fontWeight:'bold'
   } 
   const questionStyle={
    fontSize:'24px',
    color:'#191919',
    fontWeight:'semibold'
   }
   const optionStylesCtn={
    padding:'12px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
   }
   const optionStyle={
    display:'flex',
    color:'#5e5e5e',
    flexDirection:'row',
    gap:'10px',
    fontSize:'20px',
    cursor: 'pointer',
    border:'1px solid rgb(167, 167, 167)',
    padding:'6px',
    borderRadius:'6px',
   }


  return (
    <div>
    {/* Current Question Position & Question*/}
        <div style={{display:'grid',gridColumn:'2'}}>
            <p style={questionPos}>Question 1 of 10</p>
            <h2 style={questionStyle}>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC</h2>
        </div>  
    {/* Options */}
        <div style={optionStylesCtn}>
            {options?.map((item,index)=><h3 style={optionStyle} key={index}><span>{optionDef[index]}.</span> <span>{item}</span></h3>)}
        </div>  
    </div>
  )
}

export default QuestionSection