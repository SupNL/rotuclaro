import api from '../api';

const fetchUsers = (tokenSource, lastId) => {
    return new Promise((resolve) => {
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
                console.log({ err });
            });
    });
};

const fetchOneUser = (tokenSource, id) => {
    return new Promise((resolve) => {
        let url = `/usuario/${id}`;

        api.get(url, {
            cancelToken: tokenSource
        })
            .then((response) => {
                const data = response.data;
                resolve(data);
            })
            .catch((err) => {
                console.log({ err });
            });
    });
};

export { fetchUsers, fetchOneUser };
