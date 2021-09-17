import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

export const handleQueryFailedError = (error : Error, _: Request, res: Response): Response => {
    console.error(error);
    if(error instanceof QueryFailedError) { 
        // Chave duplicada
        if(parseInt(error['code']) == 23505) {
            const detail: string = error['detail'];
            
            const matchKey = detail.match(/.* \((?<key>\w+)\).*/);
    
            res.statusCode = 409;
            return res.json({ message: `${matchKey.groups.key} já está em uso` });
        }

        // violação de chave estrangeira (inexistente)
        if(parseInt(error['code']) == 23503) {
            const detail: string = error['detail'];
            console.log(detail);
            
            const matchKey = detail.match(/.* \((?<key1>\w+)\)=\((?<key2>\w+)\).*/);

            if(matchKey.groups.key1 == 'id_componente') {
                return res.status(400).json({ message: `Componente alergênico de ID ${matchKey.groups.key2} inexistente` });
            }
        }
    }
    return res.status(500).json({ message: 'Erro de servidor' });
};