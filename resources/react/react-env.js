const STEPS_ENDPOINT = '/form/steps';
const BASE_FORM_ENDPOINT = '/form';
const FORM_ENDPOINT_WITH_PARAMS = '/form/:step';
const QUESTIONS_ENDPOINT = '/form/:step/questions';
const PREV_ANSWERED_ENDPOINT = '/form/:step/prev-answered';
const ANSWERS_ENDPOINT = '/form/:step/answers';
const FORM_SUBMIT_ENDPOINT = '/form/:step/submit';

function getFormEndPoint(step) {
    return `/form/${step}`;
}

function getPrevAnsweredEndPoint(step) {
    return `/form/${step}/prev-answered`;
}

function getQuestionsEndPoint(step) {
    return `/form/${step}/questions`;
}

function getAnswersEndPoint(step) {
    return `/form/${step}/answers`;
}

export {
    BASE_FORM_ENDPOINT,
    FORM_ENDPOINT_WITH_PARAMS,
    STEPS_ENDPOINT,
    QUESTIONS_ENDPOINT,
    PREV_ANSWERED_ENDPOINT,
    ANSWERS_ENDPOINT,
    FORM_SUBMIT_ENDPOINT,
    getFormEndPoint,
    getPrevAnsweredEndPoint,
    getQuestionsEndPoint,
    getAnswersEndPoint
};
