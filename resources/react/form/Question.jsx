import React from "react";

export default function Question({ question, answers, handleChange, formData }) {

    return (
        <div className="form-group">
            <label htmlFor={question.id}>{question.question_text}</label>
            <select
                id={question.id}
                name={question.id}
                value={formData[question.id]}
                onChange={handleChange}
            >
                <option className="select-option" value="">Select</option>
                {answers.map((answer) => (
                    <option key={answer.id} value={answer.id}>
                        {answer.answer_text}
                    </option>
                ))}
            </select>
        </div>
    );
}
