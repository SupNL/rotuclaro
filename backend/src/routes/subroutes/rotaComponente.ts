import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { FindManyOptions, MoreThan } from 'typeorm';
import ControleComponenteAlergenico from '../../controller/ControleComponenteAlergenico';
import { expectAdmin } from '../../middleware/expectAdmin';

const rotaComponente = Router();

rotaComponente.get('/', async (req, res) => {
    try {
        const options: FindManyOptions = {
            order : {
                nome : 'ASC'
            }
        };

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
            typeof req.query['last_name'] == 'string'
        ) {
            options.where = {
                nome : MoreThan(req.query['last_name'])
            };
        }

        const [componentes, totalCount] =
            await ControleComponenteAlergenico.findMany(options);

        res.set('x-total-count', totalCount.toString());

        const mappedComponentes = componentes.map(async c => {
            const isAssociated = await ControleComponenteAlergenico.isAssociatedWithProfile(c);
            if (isAssociated)
                return {...c, permiteExclusao: false };
            return {...c, permiteExclusao: true };
        });

        Promise.all(mappedComponentes).then(componentes => {
            return res.status(200).json(componentes);
        });
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro de servidor' });
    }
});

rotaComponente.post(
    '/',
    expectAdmin,
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            nome: Joi.string().required().min(1),
        }),
    }),
    async (req, res) => {
        try {
            const instance = ControleComponenteAlergenico.convertBody(req.body);
            const componenteAlergenico =
                await ControleComponenteAlergenico.create(instance);

            return res.status(201).json(componenteAlergenico);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro de servidor' });
        }
    }
);

rotaComponente.put(
    '/:id',
    expectAdmin,
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
    expectAdmin,
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
