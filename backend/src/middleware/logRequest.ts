import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface jwtPayloadObject {
    id: number;
    nivel: number;
    login : string;
}

export function logRequest(
    req: Request,
    res: Response,
    next: NextFunction
): unknown {
    let message = '';

    message += '\n';
    message += new Date().toISOString() + '\n';
    message += req.method.toUpperCase() + ' ';
    message += req.url + '\n';
    message += 'IP: ' + req.ip + '\n';
    message += 'User: ';

    if(req.headers.authorization) {
        const { authorization } = req.headers;
        try {
            const [, token] = authorization.split('Bearer ');
            const decoded = jwt.verify(token, process.env.SERVER_SECRET);
            const { login } = decoded as jwtPayloadObject;
            message += `${login}`;
        } catch (err) {
            message += 'com token inválido';
        }
    } else {
        message += 'não autenticado';
    }

    if(req.body) {
        message += '\nBody: ';
        message += JSON.stringify(req.body);
    }
    

    console.log(message);
    return next();
}
