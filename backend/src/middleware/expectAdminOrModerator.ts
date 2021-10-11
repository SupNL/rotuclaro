import { NextFunction, Request, Response } from 'express';
import { NivelUsuario } from '../model/Usuario';

export function expectAdminOrModerator(
    req: Request,
    res: Response,
    next: NextFunction
): unknown {
    if (!req.usuario) {
        return res.status(400).json({ message: 'Erro com a autenticação' });
    }

    const { nivel } = req.usuario;

    if (nivel === NivelUsuario.ADMIN || nivel === NivelUsuario.MODERADOR) {
        return next();
    }
    return res.status(403).json({ message: 'Permissões insuficientes' });
}
