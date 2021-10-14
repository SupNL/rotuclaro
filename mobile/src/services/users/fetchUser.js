import api from '../api';

const fetchUsers = (tokenSource, lastId) => {
    return new Promise((resolve, reject) => {
        let url = '/usuario';

        if (lastId) url += `?last_id=${lastId}`;

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

const fetchOneUser = (tokenSource, id) => {
    return new Promise((resolve, reject) => {
        let url = `/usuario/${id}`;

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

export { fetchUsers, fetchOneUser };
