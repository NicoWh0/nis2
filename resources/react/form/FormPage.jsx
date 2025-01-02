import React, { useEffect, useState } from "react";
import { instance as axios } from "../helper/AxiosInterceptor";
import { useParams } from "react-router-dom";
import Question from "./Question";
import GridLoader from "react-spinners/GridLoader";

export default function FormPage({ formData, handleChange }) {
    const { step } = useParams();
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        axios.get(`/form/${step}/questions`).then((response) => {
            console.log(response.data);
            const questionsResult = response.data;
            setQuestions(questionsResult);
        });
    }, [step]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
         questions ? (
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
        ) :
        (
            <div className="loader">
                <GridLoader color="#000" loading={true} size={15} />
            </div>

        )
    );
}
