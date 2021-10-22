import {
    DeleteResult,
    FindManyOptions,
    FindOneOptions,
    getConnection,
} from 'typeorm';
import { ComponenteAlergenico } from '../model/ComponenteAlergenico';

export default {
    convertBody(
        entityBody: Partial<ComponenteAlergenico>
    ): ComponenteAlergenico {
        const connection = getConnection();
        const repo = connection.getRepository(ComponenteAlergenico);
        const componenteAlergenico = repo.create(entityBody);
        return componenteAlergenico;
    },

    isAssociatedWithProfile(comp: ComponenteAlergenico): Promise<boolean> {
        return new Promise((resolve) => {
            const connection = getConnection();
            const query = connection
                .getRepository(ComponenteAlergenico)
                .createQueryBuilder('ca')
                .innerJoin(
                    'componentes_perfis',
                    'cp',
                    'ca.id = cp.id_componente'
                )
                .where('ca.id = :cId', { cId: comp.id });

            query.getCount().then((count) => {
                count > 0 ? resolve(true) : resolve(false);
            });
        });
    },

    async findMostAvoidedComponent(): Promise<{ componentName : string, count : number}> {
        interface rawResult {
            componente_nome : string;
            count : string;
        }

        const connection = getConnection();
        const queryBuilder = connection
            .getRepository(ComponenteAlergenico)
            .createQueryBuilder('componente');

        const query = queryBuilder
            .innerJoin(
                'componentes_perfis',
                'cp',
                'cp.id_componente = componente.id'
            )
            .select('componente')
            .addSelect('COUNT(*) as count')
            .groupBy('componente.id')
            .orderBy('count', 'DESC');

        const raw = await query.getRawOne() as rawResult;

        if(raw) {
            return {
                componentName : raw.componente_nome,
                count : parseInt(raw.count)
            };
        } else {
            return {
                componentName : null,
                count : 0
            };
        }
        
    },

    // async findMostAvoidedComponent() : Promise<{ component : ComponenteAlergenico, count : number}> {
    //     const connection = getConnection();
    //     const queryBuilder = connection.getRepository(ComponenteAlergenico).createQueryBuilder('componente');

    //     const component = queryBuilder.leftJoin('componentes_perfis', 'cp', 'cp.id_componente = componente.id').select('componente').addSelect('COUNT()').groupBy('')

    //     repo.count().then(totalCount => {
    //         repo.find()
    //             .then((componentes) => resolve({ component : componentes[0], count : totalCount}))
    //             .catch((err) => reject(err));
    //     });
    // },

    findMany(
        findOptions?: FindManyOptions
    ): Promise<[ComponenteAlergenico[], number]> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            const repo = connection.getRepository(ComponenteAlergenico);

            repo.count().then((totalCount) => {
                repo.find(findOptions)
                    .then((componentes) => resolve([componentes, totalCount]))
                    .catch((err) => reject(err));
            });
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
