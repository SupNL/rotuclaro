import { DeleteResult, FindManyOptions, FindOneOptions, getConnection } from 'typeorm';
import { Produto } from '../model/Produto';

export default {
    convertBody(
        entityBody : Partial<Produto>
    ) : Produto {
        const connection = getConnection();
        const repo = connection.getRepository(Produto);
        const produto = repo.create(entityBody);
        return produto;
    },

    findMany(
        findOptions?: FindManyOptions
    ): Promise<Produto[]> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            const repo = connection.getRepository(Produto);

            repo.find(findOptions)
                .then((produtos) => resolve(produtos))
                .catch((err) => reject(err));
        });
    },

    findOne(
        id: number,
        findOptions?: FindOneOptions
    ): Promise<Produto> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            const repo = connection.getRepository(Produto);

            repo.findOne(id, findOptions)
                .then((produto) => resolve(produto))
                .catch((err) => reject(err));
        });
    },

    create(
        produto: Produto
    ): Promise<Produto> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            connection
                .transaction(async (manager) => {
                    const repo = manager.getRepository(Produto);
                    return await repo.save(produto);
                })
                .then((created) => {
                    resolve(created);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    edit(
        id: number,
        produto: Produto
    ): Promise<Produto> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            connection
                .transaction(async (manager) => {
                    const repo = manager.getRepository(Produto);

                    const old = await repo.findOne(id);
                    const merged = repo.merge(old, produto);
                    return await repo.save(merged);
                })
                .then((editedProduto) => {
                    resolve(editedProduto);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    delete(id: number): Promise<DeleteResult> {
        return new Promise((resolve) => {
            const connection = getConnection();
            connection
                .transaction(async (manager) => {
                    const repo = manager.getRepository(Produto);
                    return await repo.delete(id);
                })
                .then((deleteResult) => {
                    resolve(deleteResult);
                });
        });
    },
};
