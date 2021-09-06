import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface jwtPayloadObject {
    id: number;
    nivel: number;
}

export function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
): unknown {
    if (!req.headers || !req.headers['authorization']) {
        return res
            .status(400)
            .json({ message: 'Token de autenticação não fornecido' });
    }

    const authentication = req.headers.authorization;

    try {
        const [, token] = authentication.split('Bearer ');
        const decoded = jwt.verify(token, process.env.SERVER_SECRET);
        const { id, nivel } = decoded as jwtPayloadObject;
        req.usuario = { id, nivel };
        return next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido' });
    }
}
