import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { FindManyOptions, Like, MoreThan } from 'typeorm';
import ControleProduto from '../../controller/ControleProduto';
import { expectAdmin } from '../../middleware/expectAdmin';
import { produtoLimiter } from '../../middleware/limitRequests';
import { handleQueryFailedError } from '../../utils/errorHandler';

const rotaProduto = Router();

rotaProduto.get('/', expectAdmin, async (req, res) => {
    try {
        const options: FindManyOptions = {
            order : {
                nome : 'ASC'
            },
        };

        let where = {};

        if (
            typeof req.query['nome'] == 'string'
        ) {
            where = {
                ...where,
                nome : Like('%' + req.query['nome'] + '%'),
            };
        }

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
            where = {
                ...where,
                nome : MoreThan(req.query['last_name'])
            };
        }

        options.where = where;

        const [produtos, total] = await ControleProduto.findMany(options);

        res.set('x-total-count', total.toString());

        return res.status(200).json(produtos);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro de servidor' });
    }
});

rotaProduto.get(
    '/:codigo_ou_id',
    celebrate({
        [Segments.HEADERS]: Joi.object()
            .keys({
                idunico: Joi.string().required().min(1),
            })
            .unknown(),
    }),
    produtoLimiter,
    async (req, res) => {
        try {
            const { codigo_ou_id } = req.params;

            const produtos = await ControleProduto.findMany({
                where: [
                    {
                        codigo: codigo_ou_id,
                    },
                    {
                        id: codigo_ou_id.length > 10 ? undefined : codigo_ou_id,
                    },
                ],
                relations: ['componentesAlergenicos'],
            });
            if (produtos.length > 0) {
                const produto = produtos[0][0];
                return res.status(200).json(produto);
            }
            return res.status(404).json({ message: 'Não encontrado' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro de servidor' });
        }
    }
);

rotaProduto.post(
    '/',
    expectAdmin,
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            codigo: Joi.string().required().min(1),
            nome: Joi.string().required().min(1),
            gramasOuMlPorcao: Joi.number().required().greater(0),
            liquido: Joi.bool().required(),
            kcal: Joi.number().required().min(0),
            carboidratos: Joi.number().required().min(0),
            acucares: Joi.number().required().min(0),
            gorduras: Joi.number().required().min(0),
            gordurasTrans: Joi.number().required().min(0),
            gordurasSaturadas: Joi.number().required().min(0),
            sodio: Joi.number().required().min(0),
            proteinas: Joi.number().required().min(0),
            fibras: Joi.number().required().min(0),
            ingredientes: Joi.string().required().min(1),
            componentesAlergenicos: Joi.array()
                .optional()
                .items(
                    Joi.object().keys({
                        id: Joi.number().required().min(0),
                    })
                ),
        }),
    }),
    async (req, res) => {
        try {
            const instance = ControleProduto.convertBody(req.body);
            const produto = await ControleProduto.create(instance);

            return res.status(201).json(produto);
        } catch (err) {
            handleQueryFailedError(err, req, res);
        }
    }
);

rotaProduto.put(
    '/:id',
    expectAdmin,
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            codigo: Joi.string().optional().min(1),
            nome: Joi.string().optional().min(1),
            gramasOuMlPorcao: Joi.number().optional().greater(0),
            liquido: Joi.bool().optional(),
            kcal: Joi.number().optional().min(0),
            carboidratos: Joi.number().optional().min(0),
            acucares: Joi.number().optional().min(0),
            gorduras: Joi.number().optional().min(0),
            gordurasTrans: Joi.number().optional().min(0),
            gordurasSaturadas: Joi.number().optional().min(0),
            sodio: Joi.number().optional().min(0),
            proteinas: Joi.number().optional().min(0),
            fibras: Joi.number().optional().min(0),
            ingredientes: Joi.string().optional().min(1),
            componentesAlergenicos: Joi.array()
                .optional()
                .items(
                    Joi.object().keys({
                        id: Joi.number().required().min(0),
                    })
                ),
        }),
    }),
    async (req, res) => {
        try {
            const { id } = req.params;
            if (isNaN(parseInt(id))) {
                return res.status(404).json({ message: 'Não encontrado' });
            }
            const produtoToChange = await ControleProduto.findOne(parseInt(id));

            if (produtoToChange == null)
                return res.status(404).json({ message: 'Não encontrado' });

            const receivedBody = ControleProduto.convertBody(req.body);
            const produto = await ControleProduto.edit(
                parseInt(id),
                receivedBody
            );

            return res.status(200).json(produto);
        } catch (err) {
            handleQueryFailedError(err, req, res);
        }
    }
);

rotaProduto.delete('/:id', expectAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id))) {
            return res.status(404).json({ message: 'Não encontrado' });
        }

        const deleteResult = await ControleProduto.delete(parseInt(id));

        if (deleteResult.affected == 0)
            return res.status(404).json({ message: 'Não encontrado' });

        return res.status(204).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro de servidor' });
    }
});

export default rotaProduto;
