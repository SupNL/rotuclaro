import { DeleteResult, FindManyOptions, getConnection } from 'typeorm';
import { CodigoJaExisteError } from '../errors/CodigoJaExisteError';
import { Sugestao } from '../model/Sugestao';
import ControleProduto from './ControleProduto';

export default {
    convertBody(entityBody: Partial<Sugestao>): Sugestao {
        const connection = getConnection();
        const repo = connection.getRepository(Sugestao);
        const sugestao = repo.create(entityBody);
        return sugestao;
    },

    findMany(findOptions?: FindManyOptions): Promise<[Sugestao[], number]> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            const repo = connection.getRepository(Sugestao);

            repo.count().then((totalCount) => {
                repo.find(findOptions)
                    .then((sugestoes) => resolve([sugestoes, totalCount]))
                    .catch((err) => reject(err));
            });
        });
    },

    create(sugestao: Sugestao): Promise<Sugestao> {
        return new Promise((resolve, reject) => {
            ControleProduto.findMany({
                where: {
                    codigo: sugestao.codigo,
                },
            }).then(([produtos]) => {
                if (produtos.length > 0) {
                    reject(new CodigoJaExisteError());
                } else {
                    const connection = getConnection();
                    connection
                        .transaction(async (manager) => {
                            const repo = manager.getRepository(Sugestao);
                            const old = await repo.findOne(sugestao.codigo);
                            if (old) {
                                repo.merge(sugestao, old);
                                sugestao.vezesSugeridas += 1;
                            } else {
                                sugestao.vezesSugeridas = 1;
                            }
                            return await repo.save(sugestao);
                        })
                        .then((created) => {
                            resolve(created);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            });
        });
    },

    delete(codigo: string): Promise<DeleteResult> {
        return new Promise((resolve) => {
            const connection = getConnection();
            connection
                .transaction(async (manager) => {
                    const repo = manager.getRepository(Sugestao);
                    return await repo.delete(codigo);
                })
                .then((deleteResult) => {
                    resolve(deleteResult);
                });
        });
    },
};
