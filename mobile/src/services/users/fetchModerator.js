import api from '../api';

const fetchModerators = (tokenSource, lastId) => {
    return new Promise((resolve, reject) => {
        let url = '/usuario?moderador=true';

        if (lastId) url += `&last_id=${lastId}`;

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

export { fetchModerators };
