import { Request } from 'express';
import rateLimit from 'express-rate-limit';

function customImeiKeyGenerator(req : Request) {
    const imei = req.headers['imei'];
    return `${req.ip}+${imei}`;
}

export const serverLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 40
});

export const produtoLimiter = rateLimit({
    windowMs: 10 * 1000,
    max: 1,
    keyGenerator : customImeiKeyGenerator,
});

export const accountCreationLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 1,
    keyGenerator : customImeiKeyGenerator,
});