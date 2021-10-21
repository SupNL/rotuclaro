import api from '../api';

const fetchProducts = (tokenSource, lastName, name) => {
    return new Promise((resolve, reject) => {
        const url = '/produto';
        api.get(url, {
            cancelToken: tokenSource,
            params : {
                last_name : lastName,
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
