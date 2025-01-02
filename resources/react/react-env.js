const STEPS_ENDPOINT = '/form/steps';
const BASE_FORM_ENDPOINT = '/form';
const FORM_ENDPOINT_WITH_PARAMS = '/form/:step';
const QUESTIONS_ENDPOINT = '/form/:step/questions';

function getFormEndPoint(step) {
    return `/form/${step}`;
}

export {
    BASE_FORM_ENDPOINT,
    FORM_ENDPOINT_WITH_PARAMS,
    STEPS_ENDPOINT,
    QUESTIONS_ENDPOINT,
    getFormEndPoint
};
