import api from '../api';

const fetchModerators = (tokenSource, lastId, name) => {
    return new Promise((resolve, reject) => {
        let url = '/usuario?moderador=true';

        api.get(url, {
            cancelToken: tokenSource,
            params : {
                last_id : lastId,
                nome : name,
            }
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

export { fetchModerators };
