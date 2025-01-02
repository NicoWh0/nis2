import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const AxiosInterceptor = ({ children }) => {
    const navigate = useNavigate();
    const [isSetup, setIsSetup] = useState(false);
    useEffect(() => {
        const configUse = instance.interceptors.request.use(onRequest);
        const interceptors = instance.interceptors.response.use(
            response => {
                console.log('Axios: Response received from path: ', response.config.url);
                return response;
            },
            error => {
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
