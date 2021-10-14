import api from '../api';

const fetchSuggestions = (tokenSource, lastDate, lastCount) => {
    return new Promise((resolve, reject) => {
        let url = '/sugestao';

        if (lastDate && lastCount) url += `?last_date=${lastDate}&last_count=${lastCount}`;

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


export { fetchSuggestions };
