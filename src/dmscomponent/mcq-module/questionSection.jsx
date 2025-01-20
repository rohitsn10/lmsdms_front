import React from 'react';
import PropTypes from 'prop-types';

function QuestionSection({ question, questionIndex }) {
    if (!question) return null; // Handle case where question is not available
    
    const { question_text, options } = question;

    // Styles
    const questionPos = {
        fontSize: '19px',
        color: '#gray',
        fontWeight: 'bold'
    };
    const questionStyle = {
        fontSize: '24px',
        color: '#191919',
        fontWeight: 'semibold'
    };
    const optionStylesCtn = {
        padding: '12px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
    };
    const optionStyle = {
        display: 'flex',
        color: '#5e5e5e',
        flexDirection: 'row',
        gap: '10px',
        fontSize: '20px',
        cursor: 'pointer',
        border: '1px solid rgb(167, 167, 167)',
        padding: '6px',
        borderRadius: '6px',
    };

    return (
        <div>
            {/* Current Question Position & Question */}
            <div style={{ display: 'grid', gridColumn: '2' }}>
                <p style={questionPos}>Question {questionIndex} of {options?.length-1}</p>
                <h2 style={questionStyle}>{question_text}</h2>
            </div>
            {/* Options */}
            <div style={optionStylesCtn}>
                {options.map((option, index) => (
                    <h3 style={optionStyle} key={index}>
                        <span>{String.fromCharCode(65 + index)}.</span> <span>{option.text}</span>
                    </h3>
                ))}
            </div>
        </div>
    );
}
QuestionSection.propTypes = {
  question: PropTypes.shape({
      question_text: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
          PropTypes.shape({
              text: PropTypes.string.isRequired,
              is_correct: PropTypes.bool
          })
      ).isRequired
  }),
  questionIndex: PropTypes.number.isRequired
};

export default QuestionSection;