import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { FindManyOptions } from 'typeorm';
import ControlePerfil from '../../controller/ControlePerfil';
import ControleUsuario from '../../controller/ControleUsuario';
import { expectAdmin } from '../../middleware/expectAdmin';
import { requireAuth } from '../../middleware/requireAuth';
import { Perfil } from '../../model/Perfil';
import { NivelUsuario, Usuario } from '../../model/Usuario';
import { handleQueryFailedError } from '../../utils/errorHandler';

const rotaPerfil = Router();

const validateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id))) {
            return res.status(404).json({ message: 'Não encontrado' });
        }

        const perfil = await ControlePerfil.findOne(parseInt(id), {
            relations: ['usuario'],
        });

        if (perfil) {
            if (
                req.usuario.nivel == NivelUsuario.ADMIN ||
                perfil.usuario.id == req.usuario.id
            )
                return next();
            return res.status(404).json({ message: 'Não encontrado' });
        }
        return res.status(404).json({ message: 'Não encontrado' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro de servidor' });
    }
};

rotaPerfil.get('/', requireAuth, expectAdmin, async (req, res) => {
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

        const perfis = await ControlePerfil.findMany(options);

        return res.status(200).json(perfis);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro de servidor' });
    }
});

rotaPerfil.get('/:id', requireAuth, validateUser, async (req, res) => {
    try {
        const { id } = req.params;

        const perfil = await ControlePerfil.findOne(parseInt(id));

        if (perfil) {
            return res.status(200).json(perfil);
        }

        return res.status(404).json({ message: 'Não encontrado' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro de servidor' });
    }
});

rotaPerfil.post(
    '/',
    requireAuth,
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            gramas: Joi.number().required().greater(0),
            limiteMedioKcal: Joi.number().required().greater(0),
            limiteAltoKcal: Joi.number().required().greater(0),
            limiteMedioCarboidratos: Joi.number().required().greater(0),
            limiteAltoCarboidratos: Joi.number().required().greater(0),
            limiteMedioAcucares: Joi.number().required().greater(0),
            limiteAltoAcucares: Joi.number().required().greater(0),
            limiteMedioGordurasTotais: Joi.number().required().greater(0),
            limiteAltoGordurasTotais: Joi.number().required().greater(0),
            limiteMedioGordurasTrans: Joi.number().required().min(0),
            limiteAltoGordurasTrans: Joi.number().required().min(0),
            limiteMedioGordurasSaturadas: Joi.number().required().min(0),
            limiteAltoGordurasSaturadas: Joi.number().required().min(0),
            limiteMedioSodio: Joi.number().required().greater(0),
            limiteAltoSodio: Joi.number().required().greater(0),
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
            const checkPerfil = await ControlePerfil.findMany({
                where: {
                    usuario: {
                        id: req.usuario.id,
                    },
                },
            });

            if (checkPerfil.length > 0) {
                return res
                    .status(409)
                    .json({ message: 'Perfil já cadastrado' });
            }

            const instance = ControlePerfil.convertBody(req.body);
            instance.usuario = new Usuario();
            instance.usuario.id = req.usuario.id;
            const perfil = await ControlePerfil.create(instance);

            instance.usuario.perfil = new Perfil();
            instance.usuario.perfil.id = perfil.id;
            await ControleUsuario.create(instance.usuario);

            delete perfil.usuario;

            return res.status(201).json(perfil);
        } catch (err) {
            handleQueryFailedError(err, req, res);
        }
    }
);

rotaPerfil.put(
    '/:id',
    requireAuth,
    validateUser,
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            gramas: Joi.number().optional().greater(0),
            limiteMedioKcal: Joi.number().optional().greater(0),
            limiteAltoKcal: Joi.number().optional().greater(0),
            limiteMedioCarboidratos: Joi.number().optional().greater(0),
            limiteAltoCarboidratos: Joi.number().optional().greater(0),
            limiteMedioAcucares: Joi.number().optional().greater(0),
            limiteAltoAcucares: Joi.number().optional().greater(0),
            limiteMedioGordurasTotais: Joi.number().optional().greater(0),
            limiteAltoGordurasTotais: Joi.number().optional().greater(0),
            limiteMedioGordurasTrans: Joi.number().optional().min(0),
            limiteAltoGordurasTrans: Joi.number().optional().min(0),
            limiteMedioGordurasSaturadas: Joi.number().optional().min(0),
            limiteAltoGordurasSaturadas: Joi.number().optional().min(0),
            limiteMedioSodio: Joi.number().optional().greater(0),
            limiteAltoSodio: Joi.number().optional().greater(0),
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

            const perfilToChange = await ControlePerfil.findOne(parseInt(id));

            if (perfilToChange == null)
                return res.status(404).json({ message: 'Não encontrado' });

            const receivedBody = ControlePerfil.convertBody(req.body);
            const perfil = await ControlePerfil.edit(
                parseInt(id),
                receivedBody
            );

            return res.status(200).json(perfil);
        } catch (err) {
            handleQueryFailedError(err, req, res);
        }
    }
);

export default rotaPerfil;
