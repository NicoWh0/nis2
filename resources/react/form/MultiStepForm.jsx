import React, { useState, useEffect, useRef } from "react";
import { instance as axios } from "../helper/AxiosInterceptor";
import {  useNavigate } from "react-router-dom";
import FormPage from "./FormPage";
import { getFormEndPoint, getPrevAnsweredEndPoint, getAnswersEndPoint } from "../react-env";
import PopupResult from "../others/PopupResult";
import GridLoader from "react-spinners/GridLoader";

export default function MultiStepForm({totalSteps, currentStep}) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [done, setDone] = useState(false);
    const [finalResult, setFinalResult] = useState({});
    const formCache = useRef({});

    useEffect(() => {
        const previousData = async () => {
            await axios.get(getPrevAnsweredEndPoint(currentStep));
        }
        previousData();
    }, [currentStep]);

    useEffect(() => {
        if(formCache.current[currentStep]) {
            setFormData(formCache.current[currentStep]);
            return;
        }
        axios.get(getAnswersEndPoint(currentStep)).then((response) => {
            console.log('Into the get answers endpoint: ', response);
            console.log("Answers: ", response.data);
            const answers = response.data;
            const newFormData = {};
            answers.forEach((answer) => {
                newFormData[answer.question_id] = answer.answer_id;
            });
            setFormData(newFormData);
            formCache.current[currentStep] = newFormData;
        }).catch((error) => {
            if(error.response.status === 404) {
                console.log("No answers found");
            }
            else console.log("Generic error: ", error);
        }).finally(() => {
            setLoading(false);
        });
    }, [currentStep]);

    console.log("Form data: ", formData);

    const isAllQuestionsAnswered = () => {
        return questions.every((question) => {
            return formData[question.id] !== undefined;
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: Number(value) };
        if(value === "") {
            delete newFormData[name];

        }
        setFormData(newFormData);
    }

    const handleNextPage = async (e) => {
        e.preventDefault();
        const dataToSend = [];
        for(let data in formData) {
            dataToSend.push({
                question_id: Number(data),
                answer_id: formData[data]
            });
        }
        try {
            await axios.post(`/form/${currentStep}/submit`, {formValues: dataToSend});
            formCache.current[currentStep] = formData;
            setFormData({});
            navigate(getFormEndPoint(currentStep + 1));
        } catch(error) {
            console.log(error);
        }
    }

    const handleBackPage = () => {
        formCache.current[currentStep] = formData;
        navigate(getFormEndPoint(currentStep - 1));
    }

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = [];
        for(let data in formData) {
            dataToSend.push({
                question_id: Number(data),
                answer_id: formData[data]
            });
        }
        try {
            const res = await axios.post(`/form/${currentStep}/submit`, {formValues: dataToSend});
            setFormData({});
            setFinalResult({
                score: res.data.score,
                max_score: res.data.max_score,
                percent: res.data.percent
            });
            formCache.current = {};
            setDone(true);
            console.log("Final result: ", res);
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div className="form-page">
            <div className="form-title">
                <h1><span className="color-red">NIS2 directive</span> compliance</h1>
            </div>
            <div className="form-container">
                <form className="form">
                    <div className="form-steps-page-container">
                        <div className="form-steps">
                            <p>Step {currentStep} of {totalSteps ?? '?'}</p>
                        </div>
                        {
                            loading ? (
                                <div className="loading">
                                    <GridLoader color="#949494" size={15} />
                                </div>
                            ) :
                            <FormPage
                                step={currentStep}
                                formData={formData}
                                handleChange={handleChange}
                                questions={questions}
                                setQuestions={setQuestions}
                            />
                        }
                    </div>
                    <div className="form-buttons">
                        {currentStep > 1 && (
                            <button className="back-button" type="button" onClick={handleBackPage}>
                                Back
                            </button>
                        )}
                        {currentStep < totalSteps && (
                            <button className="next-button" type="submit" onClick={handleNextPage} disabled={!isAllQuestionsAnswered()}>
                                Next
                            </button>
                        )}
                        {currentStep === totalSteps && (
                            <button className="final-submit-button" type="submit" onClick={handleFinalSubmit} disabled={!isAllQuestionsAnswered()}>
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </div>
            <PopupResult open={done} close={() => {
                setDone(false);
                navigate("/");
            }} result={finalResult} />
        </div>
    );
}
