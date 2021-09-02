import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { FindManyOptions } from 'typeorm';
import ControleProduto from '../../controller/ControleProduto';

const rotaProduto = Router();

rotaProduto.get('/', async (req, res) => {
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

        const produtos = await ControleProduto.findMany(options);

        return res.status(200).json(produtos);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro de servidor' });
    }
});

rotaProduto.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id))) {
            return res.status(404).json({ message: 'Não encontrado' });
        }

        const produto = await ControleProduto.findOne(parseInt(id), {
            relations: ['componentesAlergenicos'],
        });

        if (produto) return res.status(200).json(produto);
        return res.status(404).json({ message: 'Não encontrado' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro de servidor' });
    }
});

rotaProduto.post(
    '/',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            codigo: Joi.string().required().min(1),
            nome: Joi.string().required().min(1),
            gramasPorcao: Joi.number().required().greater(0),
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
            const produto = await ControleProduto.create(req.body);

            return res.status(201).json(produto);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro de servidor' });
        }
    }
);

rotaProduto.put(
    '/:id',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            codigo: Joi.string().optional().min(1),
            nome: Joi.string().optional().min(1),
            gramasPorcao: Joi.number().optional().greater(0),
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
            console.error(err);
            return res.status(500).json({ message: 'Erro de servidor' });
        }
    }
);

rotaProduto.delete('/:id', async (req, res) => {
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
