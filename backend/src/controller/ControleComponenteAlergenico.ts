import { DeleteResult, FindManyOptions, FindOneOptions, getConnection } from 'typeorm';
import { ComponenteAlergenico } from '../model/ComponenteAlergenico';

export default {
    convertBody(
        entityBody : Partial<ComponenteAlergenico>
    ) : ComponenteAlergenico {
        const connection = getConnection();
        const repo = connection.getRepository(ComponenteAlergenico);
        const componenteAlergenico = repo.create(entityBody);
        return componenteAlergenico;
    },

    findMany(
        findOptions?: FindManyOptions
    ): Promise<ComponenteAlergenico[]> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            const repo = connection.getRepository(ComponenteAlergenico);

            repo.find(findOptions)
                .then((componentes) => resolve(componentes))
                .catch((err) => reject(err));
        });
    },

    findOne(
        id: number,
        findOptions?: FindOneOptions
    ): Promise<ComponenteAlergenico> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            const repo = connection.getRepository(ComponenteAlergenico);

            repo.findOne(id, findOptions)
                .then((componente) => resolve(componente))
                .catch((err) => reject(err));
        });
    },

    create(
        componenteAlergenico: ComponenteAlergenico
    ): Promise<ComponenteAlergenico> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            connection
                .transaction(async (manager) => {
                    const repo = manager.getRepository(ComponenteAlergenico);
                    return await repo.save(componenteAlergenico);
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
        componenteAlergenico: ComponenteAlergenico
    ): Promise<ComponenteAlergenico> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            connection
                .transaction(async (manager) => {
                    const repo = manager.getRepository(ComponenteAlergenico);

                    const old = await repo.findOne(id);
                    const merged = repo.merge(old, componenteAlergenico);
                    return await repo.save(merged);
                })
                .then((editedComponente) => {
                    resolve(editedComponente);
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
                    const repo = manager.getRepository(ComponenteAlergenico);
                    return await repo.delete(id);
                })
                .then((deleteResult) => {
                    resolve(deleteResult);
                });
        });
    },
};
