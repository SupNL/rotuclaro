import {
    DeleteResult,
    FindManyOptions,
    FindOneOptions,
    getConnection,
} from 'typeorm';
import { Produto } from '../model/Produto';
import ControleSugestao from './ControleSugestao';

export default {
    convertBody(entityBody: Partial<Produto>): Produto {
        const connection = getConnection();
        const repo = connection.getRepository(Produto);
        const produto = repo.create(entityBody);
        return produto;
    },

    findMany(findOptions?: FindManyOptions): Promise<[Produto[], number]> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            const repo = connection.getRepository(Produto);

            repo.count().then((totalCount) => {
                repo.find(findOptions)
                    .then((produtos) => resolve([produtos, totalCount]))
                    .catch((err) => reject(err));
            });
        });
    },

    findOne(
        id: number,
        findOptions?: FindOneOptions<Produto>
    ): Promise<Produto> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            const repo = connection.getRepository(Produto);

            repo.findOne(id, findOptions)
                .then((produto) => resolve(produto))
                .catch((err) => reject(err));
        });
    },

    create(produto: Produto): Promise<Produto> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            connection
                .transaction(async (manager) => {
                    const repo = manager.getRepository(Produto);
                    return await repo.save(produto);
                })
                .then((created) => {
                    ControleSugestao.delete(created.codigo).then(() => {
                        resolve(created);
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    edit(id: number, produto: Produto): Promise<Produto> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            connection
                .transaction(async (manager) => {
                    const repo = manager.getRepository(Produto);

                    const old = await repo.findOne(id);
                    const merged = repo.merge(old, produto);

                    if (produto.componentesAlergenicos)
                        merged.componentesAlergenicos =
                            produto.componentesAlergenicos;

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
