import api from '../api';

export const fetchSummary = (tokenSource) => {
    return new Promise((resolve, reject) => {
        const url = '/relatorio/resumo';
        api.get(url, {
            cancelToken: tokenSource,
        })
            .then((response) => {
                const data = response.data;

                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
