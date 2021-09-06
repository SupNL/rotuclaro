import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { FindManyOptions } from 'typeorm';
import ControleUsuario from '../../controller/ControleUsuario';
import { expectAdmin } from '../../middleware/expectAdmin';
import { accountCreationLimiter } from '../../middleware/limitRequests';
import { requireAuth } from '../../middleware/requireAuth';
import { NivelUsuario } from '../../model/Usuario';
import { handleQueryFailedError } from '../../utils/errorHandler';

const rotaUsuario = Router();

const validateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        if (isNaN(parseInt(id))) {
            return res.status(404).json({ message: 'Não encontrado' });
        } else if (
            req.usuario.nivel !== NivelUsuario.ADMIN &&
            parseInt(id) !== req.usuario.id
        ) {
            return res.status(404).json({ message: 'Não encontrado' });
        }
        return next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro de servidor' });
    }
};

rotaUsuario.get('/', requireAuth, expectAdmin, async (req, res) => {
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

        options.where = {
            ativo: true,
        };

        const usuarios = await ControleUsuario.findMany(options);

        return res.status(200).json(usuarios);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro de servidor' });
    }
});

rotaUsuario.get('/:id', requireAuth, validateUser, async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await ControleUsuario.findOne(parseInt(id), {
            where: {
                ativo: true,
            },
        });

        if (usuario) return res.status(200).json(usuario);
        return res.status(404).json({ message: 'Não encontrado' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro de servidor' });
    }
});

rotaUsuario.post(
    '/',
    celebrate({
        [Segments.HEADERS]: Joi.object()
            .keys({
                imei: Joi.string().required().min(1),
            })
            .unknown(),
        [Segments.BODY]: Joi.object().keys({
            nome: Joi.string().required().min(1),
            login: Joi.string().required().min(1),
            senha: Joi.string().required().min(1),
        }),
    }),
    accountCreationLimiter,
    async (req, res) => {
        try {
            const instance = ControleUsuario.convertBody(req.body);
            const usuario = await ControleUsuario.create(instance);
            delete usuario.senha;

            return res.status(201).json(usuario);
        } catch (err) {
            handleQueryFailedError(err, req, res);
        }
    }
);

rotaUsuario.put(
    '/:id',
    requireAuth,
    validateUser,
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            nome: Joi.string().optional().min(1),
            login: Joi.string().optional().min(1),
            senha: Joi.string().optional().min(1),
        }),
    }),
    async (req, res) => {
        try {
            const { id } = req.params;
            const usuarioToChange = await ControleUsuario.findOne(parseInt(id), {
                where : {
                    ativo : true,
                }
            });

            if (usuarioToChange == null)
                return res.status(404).json({ message: 'Não encontrado' });

            const receivedBody = ControleUsuario.convertBody(req.body);
            const usuario = await ControleUsuario.edit(
                parseInt(id),
                receivedBody
            );
            delete usuario.senha;

            return res.status(200).json(usuario);
        } catch (err) {
            handleQueryFailedError(err, req, res);
        }
    }
);

rotaUsuario.delete('/:id', requireAuth, validateUser, async (req, res) => {
    try {
        const { id } = req.params;

        const usuarioToDisable = await ControleUsuario.findOne(parseInt(id), {
            where: {
                ativo: true,
            },
        });

        if (usuarioToDisable == null)
            return res.status(404).json({ message: 'Não encontrado' });

        usuarioToDisable.ativo = false;
        await ControleUsuario.edit(parseInt(id), usuarioToDisable);

        return res.status(200).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro de servidor' });
    }
});

export default rotaUsuario;
