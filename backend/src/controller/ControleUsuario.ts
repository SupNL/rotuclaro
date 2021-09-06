import { FindManyOptions, FindOneOptions, getConnection } from 'typeorm';
import { Usuario } from '../model/Usuario';

export default {
    convertBody(
        entityBody : Partial<Usuario>
    ) : Usuario {
        const connection = getConnection();
        const repo = connection.getRepository(Usuario);
        const usuario = repo.create(entityBody);
        return usuario;
    },

    findMany(
        findOptions?: FindManyOptions
    ): Promise<Usuario[]> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            const repo = connection.getRepository(Usuario);

            repo.find(findOptions)
                .then((usuarios) => resolve(usuarios))
                .catch((err) => reject(err));
        });
    },

    findOne(
        id: number,
        findOptions?: FindOneOptions
    ): Promise<Usuario> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            const repo = connection.getRepository(Usuario);

            repo.findOne(id, findOptions)
                .then((usuario) => resolve(usuario))
                .catch((err) => reject(err));
        });
    },

    create(
        usuario: Usuario
    ): Promise<Usuario> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            connection
                .transaction(async (manager) => {
                    const repo = manager.getRepository(Usuario);
                    return await repo.save(usuario);
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
        usuario: Usuario
    ): Promise<Usuario> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            connection
                .transaction(async (manager) => {
                    const repo = manager.getRepository(Usuario);

                    const old = await repo.findOne(id);
                    const merged = repo.merge(old, usuario);
                    return await repo.save(merged);
                })
                .then((editedUsuario) => {
                    resolve(editedUsuario);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
};
