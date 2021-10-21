import api from '../api';

const fetchUsers = (tokenSource, lastId, name) => {
    return new Promise((resolve, reject) => {
        let url = '/usuario';

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
