import { useAuth } from 'hooks/useAuth';
import React, { useEffect } from 'react';
import ShowToast from 'utils/ShowToast';
import { API_BASEURL } from '@env';
import { ToastAndroid } from 'react-native';

const ErrorInterceptor = ({api, children}) => {
    const { signOut } = useAuth();

    const handleResponseError = (response, url, method) => {
        const status = response.status;
        const route = url.split(API_BASEURL)[1];
        method = method.toUpperCase();
        
        if(status == 401 && (route != '/sessao' || method != 'POST')) {
            ShowToast('Sessão expirada.', ToastAndroid.TOP);
            signOut();
        } else if (status == 429) {
            ShowToast('Muitas requisições feitas. Aguarde antes de tentar novamente.', ToastAndroid.TOP);
        } else if (status == 500) {
            ShowToast('500 - Ocorreu um erro no servidor.', ToastAndroid.TOP);
        }
    };

    const responseInterceptor = api.interceptors.response.use(
        (res) => res,
        (error) => {
            if(error.response) {
                handleResponseError(error.response, error.request['_url'], error.request['_method']);
            } else if (error.request) {
                ShowToast('O servidor não forneceu resposta. Tente novamente mais tarde.');
            } else {
                if (api.isCancel) {
                    ShowToast('Operação cancelada.');
                } else {
                    ShowToast('Ocorreu um erro inesperado na aplicação.');
                }
            }
            throw error;
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
