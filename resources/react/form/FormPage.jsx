import React, { useEffect, useState } from "react";
import { instance as axios } from "../helper/AxiosInterceptor";
import Question from "./Question";


export default function FormPage({ step, formData, handleChange, questions, setQuestions }) {

    console.log("Current questions: ", questions);

    useEffect(() => {
        axios.get(`/form/${step}/questions`).then((response) => {
            console.log(response.data);
            const questionsResult = response.data;
            setQuestions(questionsResult);
        });
    }, [step]);

    return (
        <div className="form-page-container">
            {questions.map((question) => (
                <Question
                    key={question.id}
                    question={question}
                    answers={question.answers}
                    handleChange={handleChange}
                    formData={formData}
                />
            ))}
        </div>
    );
}
