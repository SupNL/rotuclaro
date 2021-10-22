import {
    getConnection,
} from 'typeorm';
import { RegistroConsulta } from '../model/RegistroConsulta';

export default {
    async getTodayFetches(): Promise<number> {
        const connection = getConnection();
        const queryBuilder = connection
            .getRepository(RegistroConsulta)
            .createQueryBuilder('registro');

        const query = queryBuilder
            .select('registro')
            .where('registro.data_consulta::date = NOW()::date');

        const count = await query.getCount();

        return count;
    },

    register(
        consulta: RegistroConsulta
    ): Promise<RegistroConsulta> {
        return new Promise((resolve, reject) => {
            const connection = getConnection();
            connection
                .transaction(async (manager) => {
                    const repo = manager.getRepository(RegistroConsulta);
                    return await repo.save(consulta);
                })
                .then((created) => {
                    resolve(created);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
};
