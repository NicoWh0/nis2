import React, { useState, useEffect } from "react";
import { instance as axios } from "../helper/AxiosInterceptor";
import { useParams, useNavigate } from "react-router-dom";
import FormPage from "./FormPage";
import { STEPS_ENDPOINT, getFormEndPoint } from "../react-env";

export default function MultiStepForm() {
    const { step } = useParams();
    const numStep = parseInt(step);
    const navigate = useNavigate();
    const [totalSteps, setTotalSteps] = useState(undefined);
    const [formData, setFormData] = useState([]);

    useEffect(() => {
        axios.get(STEPS_ENDPOINT).then((response) => {
            console.log("Number of steps: ", response.data);
            setTotalSteps(response.data.totalSteps);
            if(numStep > response.data.totalSteps) {
                navigate(getFormEndPoint(response.data.totalSteps));
            }
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    console.log("Form data: ", formData);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleNextPage = () => {
        navigate(getFormEndPoint(numStep + 1));
    }

    const handleBackPage = () => {
        navigate(getFormEndPoint(numStep - 1));
    }

    if(numStep < 1 || numStep > totalSteps) {
        return <h1>400 Bad Request</h1>
    }

    return (
        <div className="form-page">
            <div className="form-title">
                <h1>Compliance direttiva <span className="color-red">NIS 2</span></h1>
            </div>
            <div className="form-container">
                <form className="form">
                    <div className="form-steps-page-container">
                        <div className="form-steps">
                            <p>Step {step} of {totalSteps ?? '?'}</p>
                        </div>
                        <FormPage
                            formData={formData}
                            handleChange={handleChange}
                        />
                    </div>
                    <div className="form-buttons">
                        {numStep > 1 && (
                            <button className="back-button" type="button" onClick={handleBackPage}>
                                Back
                            </button>
                        )}
                        {numStep < totalSteps && (
                            <button className="next-button" type="button" onClick={handleNextPage}>
                                Next
                            </button>
                        )}
                        {numStep === totalSteps && (
                            <button className="final-submit-button" type="submit">
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
