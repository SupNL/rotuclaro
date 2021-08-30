import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { FindManyOptions } from 'typeorm';
import ControleComponenteAlergenico from '../../controller/ControleComponenteAlergenico';

const rotaComponente = Router();

rotaComponente.get('/', async (req, res) => {
    try {
        const options: FindManyOptions = {};

        if (
            typeof req.query.limit == 'string' &&
            !isNaN(parseInt(req.query.limit)) &&
            parseInt(req.query.limit) > 0
        ) {
            options.take = Number(req.query.limit);
        } else {
            options.take = 10;
        }

        if (
            typeof req.query.page == 'string' &&
            !isNaN(parseInt(req.query.page)) &&
            parseInt(req.query.page) > 0
        ) {
            options.skip = (Number(req.query.page) - 1) * options.take;
        } else {
            options.skip = 0;
        }

        const componenteAlergenico =
            await ControleComponenteAlergenico.findMany(options);

        return res.status(200).json(componenteAlergenico);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro de servidor' });
    }
});

rotaComponente.post(
    '/',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            nome: Joi.string().required().min(1),
        }),
    }),
    async (req, res) => {
        try {
            const componenteAlergenico =
                await ControleComponenteAlergenico.create(req.body);

            return res.status(201).json(componenteAlergenico);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro de servidor' });
        }
    }
);

rotaComponente.put(
    '/:id',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            nome: Joi.string().optional().min(1),
        }),
    }),
    async (req, res) => {
        try {
            const { id } = req.params;
            if (
                typeof id == 'string' &&
                isNaN(parseInt(id))
            ) {
                return res.status(404).json({ message: 'Não encontrado' });
            }
            const componenteToChange =
                await ControleComponenteAlergenico.findOne(parseInt(id));

            if (componenteToChange == null)
                return res.status(404).json({ message: 'Não encontrado' });

            const receivedBody = ControleComponenteAlergenico.convertBody(req.body);
            const componenteAlergenico = await ControleComponenteAlergenico.edit(parseInt(id), receivedBody);

            return res.status(200).json(componenteAlergenico);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro de servidor' });
        }
    }
);

rotaComponente.delete(
    '/:id',
    async (req, res) => {
        try {
            const { id } = req.params;
            if (
                typeof id == 'string' &&
                isNaN(parseInt(id))
            ) {
                return res.status(404).json({ message: 'Não encontrado' });
            }

            const deleteResult =
                await ControleComponenteAlergenico.delete(parseInt(id));

            if (deleteResult.affected == 0)
                return res.status(404).json({ message: 'Não encontrado' });

            return res.status(204).send();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro de servidor' });
        }
    }
);

export default rotaComponente;
