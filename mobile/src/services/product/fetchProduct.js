import api from '../api';

const fetchProducts = (tokenSource, lastName) => {
    return new Promise((resolve, reject) => {
        let url = '/produto';

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

const fetchOneProduct = (tokenSource, id, uniqueId) => {
    return new Promise((resolve, reject) => {
        let url = `/produto/${id}`;

        api.get(url, {
            cancelToken: tokenSource,
            headers : {
                idunico: uniqueId
            }
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

export { fetchProducts, fetchOneProduct };
