import { Request } from 'express';
import rateLimit from 'express-rate-limit';
import { NivelUsuario } from '../model/Usuario';

function customImeiKeyGenerator(req: Request) {
    const idUnico = req.headers.idUnico;
    return `${req.ip}+${idUnico}`;
}

export const serverLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 40,
});

export const produtoLimiter = rateLimit({
    windowMs: 10 * 1000,
    max: 1,
    keyGenerator: customImeiKeyGenerator,
    skipFailedRequests: true,
    skip: (req) => {
        if (req.usuario) {
            if (req.usuario.nivel == NivelUsuario.ADMIN) return true;
        }
        return false;
    },
});

export const accountCreationLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 1,
    keyGenerator: customImeiKeyGenerator,
    skipFailedRequests: true,
});
