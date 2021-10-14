import { Request } from 'express';
import rateLimit from 'express-rate-limit';
import { NivelUsuario } from '../model/Usuario';

function customImeiKeyGenerator(req: Request) {
    const idunico = req.headers.idunico;
    return `${req.ip}+${idunico}`;
}

function customImeiKeyPlusCodeGenerator(req: Request) {
    const idunico = req.headers.idunico;
    const codigo = req.params['codigo'];
    console.log(`${req.ip}+${idunico}+${codigo}`);
    return `${req.ip}+${idunico}+${codigo}`;
}

export const serverLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 40,
});

export const sugestaoLimiter = rateLimit({
    windowMs: 1000 * 60 * 60 * 20,
    max: 1,
    keyGenerator: customImeiKeyPlusCodeGenerator,
    skipFailedRequests: true,
    skip: (req) => {
        if (req.usuario) {
            if (req.usuario.nivel == NivelUsuario.ADMIN) return true;
        }
        return false;
    },
});

export const produtoLimiter = rateLimit({
    windowMs: 10 * 1000,
    max: 1,
    keyGenerator: customImeiKeyGenerator,
    skipFailedRequests: true,
    skip: (req) => {
        if (req.usuario) {
            if (
                req.usuario.nivel == NivelUsuario.ADMIN ||
                req.usuario.nivel == NivelUsuario.MODERADOR
            )
                return true;
        }
        return false;
    },
});

export const accountCreationLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
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
