import React from 'react';
import PropTypes from 'prop-types';

function QuestionSection({ question, questionIndex, pageCount, onAnswerChange, answers }) {
    if (!question) return null;

    const { id, question_text, options, question_type } = question;

    const questionPos = {
        fontSize: '19px',
        color: 'gray',
        fontWeight: 'bold',
    };

    const questionStyle = {
        fontSize: '24px',
        color: '#191919',
        fontWeight: 'semibold',
    };

    const optionStylesCtn = {
        padding: '12px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
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
        backgroundColor: '#f9f9f9',
    };

    const selectedOptionStyle = {
        ...optionStyle,
        backgroundColor: '#d1e7ff', // Highlight selected option
        borderColor: '#0056b3',
    };

    const inputStyle = {
        fontSize: '20px',
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid rgb(167, 167, 167)',
        width: '100%',
        marginTop: '10px',
    };

    const renderOptions = () => {
        if (question_type === 'MCQ' || question_type === 'True/False') {
            const parsedOptions = options.split(','); // Assuming options are comma-separated
            return (
                <div style={optionStylesCtn}>
                    {parsedOptions.map((option, index) => {
                        const isSelected = answers[id] === option; // Check if the option is selected
                        return (
                            <h3
                                style={isSelected ? selectedOptionStyle : optionStyle}
                                key={index}
                                onClick={() => onAnswerChange(id, option)} // Trigger answer change on click
                            >
                                <span>{String.fromCharCode(65 + index)}.</span> <span>{option}</span>
                            </h3>
                        );
                    })}
                </div>
            );
        } else if (question_type === 'Fill in the blank') {
            return (
                <input
                    type="text"
                    placeholder="Your answer"
                    value={answers[id] || ''} // Display the saved answer
                    style={inputStyle}
                    onChange={(e) => onAnswerChange(id, e.target.value)} // Trigger answer change on input
                />
            );
        }
        return null;
    };

    return (
        <div>
            <div style={{ display: 'grid', gridColumn: '2' }}>
                <p style={questionPos}>Question {questionIndex} of {pageCount}</p>
                <h2 style={questionStyle}>{question_text}</h2>
            </div>
            {renderOptions()}
        </div>
    );
}

QuestionSection.propTypes = {
    question: PropTypes.shape({
        id: PropTypes.number.isRequired,
        question_text: PropTypes.string.isRequired,
        options: PropTypes.string,
        question_type: PropTypes.string.isRequired,
    }),
    questionIndex: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    onAnswerChange: PropTypes.func.isRequired,
    answers: PropTypes.object.isRequired,
};

export default QuestionSection;
