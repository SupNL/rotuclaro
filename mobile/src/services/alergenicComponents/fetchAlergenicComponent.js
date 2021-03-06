import api from '../api';

const fetchAlergenicComponents = (tokenSource, lastName) => {
    return new Promise((resolve, reject) => {
        let url = '/componente_alergenico';

        if (lastName) url += `?last_name=${lastName}`;

        api.get(url, {
            cancelToken: tokenSource,
        })
            .then((response) => {
                const data = response.data;
                const totalCount = response.headers['x-total-count'];

                resolve([data, totalCount]);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export { fetchAlergenicComponents };
