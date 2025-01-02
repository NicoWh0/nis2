import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MultiStepForm from "./form/MultiStepForm";
import { BASE_FORM_ENDPOINT, FORM_ENDPOINT_WITH_PARAMS, getFormEndPoint } from "./react-env";

export default function Main() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to={getFormEndPoint(1)}/>} />
            <Route path={BASE_FORM_ENDPOINT} element={<Navigate to={getFormEndPoint(1)}/>} />
            <Route path={FORM_ENDPOINT_WITH_PARAMS} element={<MultiStepForm />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
    );
}

