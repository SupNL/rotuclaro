import { useAuth } from 'hooks/useAuth';
import React, { useEffect } from 'react';
import ShowToast from 'utils/ShowToast';
import { API_BASEURL } from '@env';
import { ToastAndroid } from 'react-native';
import axios from 'axios';

const ErrorInterceptor = ({api, children}) => {
    const { signOut } = useAuth();

    const getResponseError = (error) => {
        const response = error.response;
        const url = error.request['_url'];
        let method = error.request['_method'];

        const status = response.status;
        const route = url.split(API_BASEURL)[1];
        method = method.toUpperCase();

        console.log({ status : response.status, url : `${method} ${route}`, body : error.response.data });
        
        if(status == 401 && (route != '/sessao' || method != 'POST')) {
            ShowToast('Sessão expirada.', ToastAndroid.TOP);
            signOut();
        } else if (status == 429) {
            ShowToast('Muitas requisições feitas. Aguarde antes de tentar novamente.', ToastAndroid.TOP);
        } else if (status == 500) {
            ShowToast('Ocorreu um erro no servidor.', ToastAndroid.TOP);
        }
    };

    const responseInterceptor = api.interceptors.response.use(
        (res) => res,
        (error) => {
            if(axios.isCancel(error)) {
                console.log('Requisição cancelada', ToastAndroid.TOP);
            } else {
                if(error.response) {
                    getResponseError(error);
                } else if (error.request) {
                    ShowToast('O servidor não forneceu resposta. Tente novamente mais tarde.', ToastAndroid.TOP);
                } else {
                    console.log({ error });
                    ShowToast('Erro inesperado.', ToastAndroid.TOP);
                }
                throw error;
            }
        }
    );

    useEffect(() => {
        return () => {
            api.interceptors.response.eject(responseInterceptor);
        };
    });

    return <>{children}</>;
};

export default ErrorInterceptor;
