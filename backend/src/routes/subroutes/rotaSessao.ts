import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

import ControleUsuario from '../../controller/ControleUsuario';
import { requireAuth } from '../../middleware/requireAuth';

const rotaSessao = Router();

rotaSessao.post(
    '/',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            login: Joi.string().required().min(1),
            senha: Joi.string().required().min(1),
        }),
    }),
    async (req, res) => {
        try {
            const { login, senha } = req.body;
            const [usuarios] = await ControleUsuario.findMany({
                where: {
                    login: login,
                },
                select: ['id', 'nome', 'senha', 'nivel', 'ativo', 'login'],
                relations : ['perfil']
            });

            if(usuarios.length === 1) {
                const usuario = usuarios[0];

                if (!usuario) {
                    return res
                        .status(401)
                        .json({ message: 'Credenciais incorretos' });
                }
    
                const resultado = await compare(senha, usuario.senha);
                delete usuario.senha;
    
                if (resultado) {
                    if (usuario.ativo == false) {
                        return res
                            .status(403)
                            .json({ message: 'Sua conta foi desativada' });
                    }
                    const token = jwt.sign(
                        {
                            id: usuario.id,
                            nivel: usuario.nivel,
                            nome : usuario.nome,
                            login : usuario.login
                        },
                        process.env.SERVER_SECRET,
                        {
                            expiresIn : '2 hours'
                        }
                    );
                    return res
                        .status(200)
                        .json({ message: 'Autenticado', token: token, usuario : usuario });
                }
            }
            return res.status(401).json({ message: 'Credenciais incorretas' });
        } catch (err) {
            return res.status(500).json({ message: 'Erro de servidor' });
        }
    }
);

rotaSessao.get('/', requireAuth, (_, res) => res.status(200).send());

export default rotaSessao;
