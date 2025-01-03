import React, { useEffect, useState } from 'react';
import { instance as axios } from '../helper/AxiosInterceptor';
import { useParams } from 'react-router-dom';
import { STEPS_ENDPOINT } from '../react-env';
import MultiStepForm from '../form/MultiStepForm';

export default function FormLoader() {
    const { step } = useParams();
    const currentStep = parseInt(step);
    const [totalSteps, setTotalSteps] = useState(undefined);
    const [done, setDone] = useState(false);

    useEffect(() => {
        axios.get(STEPS_ENDPOINT).then((response) => {
            console.log("Number of steps: ", response.data);
            setTotalSteps(response.data.totalSteps);
            setDone(true);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    if(done && (isNaN(currentStep) || currentStep < 1 || currentStep > totalSteps)) {
        return <h1>404 Not Found</h1>;
    }
    else if(done) {
        return <MultiStepForm totalSteps={totalSteps} currentStep={currentStep} />;
    }

}
