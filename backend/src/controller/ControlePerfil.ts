import { FindManyOptions, FindOneOptions, getConnection } from 'typeorm';
import { Perfil } from '../model/Perfil';
// test
export default {
    convertBody(entityBody: Partial<Perfil>): Perfil {
        const connection = getConnection();
        const repo = connection.getRepository(Perfil);
        const perfil = repo.create(entityBody);
        return perfil;
    },

    count(findOptions?: FindManyOptions): Promise<number> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            const repo = connection.getRepository(Perfil);

            repo.count(findOptions)
                .then((total) => resolve(total))
                .catch((err) => reject(err));
        });
    },

    findMany(findOptions?: FindManyOptions): Promise<Perfil[]> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            const repo = connection.getRepository(Perfil);

            repo.find(findOptions)
                .then((perfis) => resolve(perfis))
                .catch((err) => reject(err));
        });
    },

    findOne(id: number, findOptions?: FindOneOptions): Promise<Perfil> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            const repo = connection.getRepository(Perfil);

            repo.findOne(id, findOptions)
                .then((perfil) => resolve(perfil))
                .catch((err) => reject(err));
        });
    },

    create(perfil: Perfil): Promise<Perfil> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            connection
                .transaction(async (manager) => {
                    const repo = manager.getRepository(Perfil);
                    return await repo.save(perfil);
                })
                .then((created) => {
                    resolve(created);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    edit(id: number, perfil: Perfil): Promise<Perfil> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();

            connection
                .transaction(async (manager) => {
                    const repo = manager.getRepository(Perfil);

                    const old = await repo.findOne(id);
                    const merged = repo.merge(old, perfil);

                    if (perfil.componentesAlergenicos)
                        merged.componentesAlergenicos =
                            perfil.componentesAlergenicos;

                    return await repo.save(merged);
                })
                .then((editedPerfil) => {
                    resolve(editedPerfil);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
};
