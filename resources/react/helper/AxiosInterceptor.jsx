import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFormEndPoint, ANSWERS_ENDPOINT, PREV_ANSWERED_ENDPOINT } from '../react-env';

const instance = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000,
    headers: {
        //'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Content-Type': 'application/json',
        //'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true,
});

const onRequest = async (config) => {
    console.log('Axios: Request sent to path: ', config.url);
    if((
        config.method === 'post' ||
        config.method === 'put' ||
        config.method === 'delete'
        ) && !Cookies.get('XSRF-TOKEN')
    ) {
        await setCSRFToken();
    }
    return config;
}

const setCSRFToken = () => {
    return instance.get('/csrf-cookie');
}


const matchAnswersEndPoint = (path) => {
    const regex = new RegExp(ANSWERS_ENDPOINT.replace(/:step/, '[1-9][0-9]*'));
    return regex.test(path);
}

const matchPrevAnsweredEndPoint = (path) => {
    const regex = new RegExp(PREV_ANSWERED_ENDPOINT.replace(/:step/, '[1-9][0-9]*'));
    return regex.test(path);
}

const AxiosInterceptor = ({ children }) => {
    const navigate = useNavigate();
    const [isSetup, setIsSetup] = useState(false);
    useEffect(() => {
        const configUse = instance.interceptors.request.use(onRequest);
        const interceptors = instance.interceptors.response.use(
            response => {
                console.log('Axios: Response received from path: ', response.config.url);

                switch(true) {
                    case matchPrevAnsweredEndPoint(response.config.url) && !response.data.answered:
                        console.log('Axios: Redirecting to step: ', response.data.step);
                        navigate(getFormEndPoint(response.data.step));
                        break;
                    default:
                        return response;
                }
            },
            error => {
                console.log('Axios: Error received from path: ', error.config.url);

                switch(true) {
                    case matchAnswersEndPoint(error.config.url) && error.response.status === 404:
                        console.log('No answers found');
                        break;
                    default:
                        break;
                }

                return Promise.reject(error);
            }
        );

        setIsSetup(true);
        return () => {
            instance.interceptors.response.eject(interceptors);
            instance.interceptors.request.eject(configUse);
        }
    }, [navigate]);

    return isSetup && children;
}

export { instance, AxiosInterceptor, setCSRFToken };
