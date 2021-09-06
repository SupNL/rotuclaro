import { NextFunction, Request, Response } from 'express';
import { NivelUsuario } from '../model/Usuario';

export function expectAdmin(
    req: Request,
    res: Response,
    next: NextFunction
): unknown {
    if (!req.usuario) {
        return res
            .status(500)
            .json({ message: 'Erro com a autenticação' });
    }

    const { nivel } = req.usuario;

    if(nivel === NivelUsuario.ADMIN) {
        return next();
    }
    return res.status(403).json({ message: 'Permissões insuficientes' });

}
