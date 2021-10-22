import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { FindManyOptions, LessThanOrEqual, MoreThan, QueryFailedError } from 'typeorm';
import ControleSugestao from '../../controller/ControleSugestao';
import { CodigoJaExisteError } from '../../errors/CodigoJaExisteError';
import { expectAdminOrModerator } from '../../middleware/expectAdminOrModerator';
import { sugestaoLimiter } from '../../middleware/limitRequests';
import { Sugestao } from '../../model/Sugestao';
import { handleQueryFailedError } from '../../utils/errorHandler';

const rotaSugestao = Router();

rotaSugestao.get('/', expectAdminOrModerator, async (req, res) => {
    try {
        const options: FindManyOptions<Sugestao> = {
            order: {
                vezesSugeridas: 'DESC',
                dataPrimeiraSugestao: 'ASC',
            },
        };

        let where = {};

        if (
            typeof req.query.limit == 'string' &&
            !isNaN(parseInt(req.query.limit)) &&
            parseInt(req.query.limit) > 0
        ) {
            options.take = Number(req.query.limit);
        } else {
            options.take = 10;
        }

        if (typeof req.query['last_date'] == 'string' && typeof req.query['last_count'] == 'string') {
            const stringDate = req.query['last_date'] as string;
            const stringCount = req.query['last_count'] as string;
            const lastCount = parseInt(stringCount);
            if(!isNaN(lastCount)){
                where = {
                    ...where,
                    dataPrimeiraSugestao: MoreThan(new Date(stringDate)),
                    vezesSugeridas: LessThanOrEqual(lastCount)
                };
            }
            
        }

        options.where = where;

        const [sugestoes, total] = await ControleSugestao.findMany(options);

        res.set('x-total-count', total.toString());

        return res.status(200).json(sugestoes);
    } catch (err) {
        return res.status(500).json({ message: 'Erro de servidor' });
    }
});

rotaSugestao.post(
    '/:codigo',
    celebrate({
        [Segments.HEADERS]: Joi.object()
            .keys({
                idunico: Joi.string().required().min(1),
            })
            .unknown(),
    }),
    sugestaoLimiter,
    async (req, res) => {
        const codigo = req.params['codigo'];
        try {
            const instance = ControleSugestao.convertBody({
                codigo,
            });
            const sugestao = await ControleSugestao.create(instance);

            return res.status(201).json(sugestao);
        } catch (err) {
            if (err instanceof QueryFailedError)
                handleQueryFailedError(err, req, res);
            else if (err instanceof CodigoJaExisteError) {
                return res
                    .status(409)
                    .json({ message: 'O produto já está cadastrado' });
            }
        }
    }
);

rotaSugestao.delete('/:codigo', expectAdminOrModerator, async (req, res) => {
    try {
        const { codigo } = req.params;

        const deleteResult = await ControleSugestao.delete(codigo);

        if (deleteResult.affected == 0)
            return res.status(404).json({ message: 'Não encontrado' });

        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: 'Erro de servidor' });
    }
});

export default rotaSugestao;
