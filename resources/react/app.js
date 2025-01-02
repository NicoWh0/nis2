import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AxiosInterceptor } from './helper/AxiosInterceptor';
import Main from './Main';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AxiosInterceptor>
                <Main />
            </AxiosInterceptor>
        </BrowserRouter>
    </React.StrictMode>
);

