import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import rotaComponente from './subroutes/rotaComponente';
import rotaPerfil from './subroutes/rotaPerfil';
import rotaProduto from './subroutes/rotaProduto';
import rotaSessao from './subroutes/rotaSessao';
import rotaUsuario from './subroutes/rotaUsuario';

const routing = Router();

routing.use('/componente_alergenico', requireAuth, rotaComponente);
routing.use('/produto', requireAuth, rotaProduto);
routing.use('/usuario', rotaUsuario);
routing.use('/perfil', rotaPerfil);
routing.use('/sessao', rotaSessao);

export default routing;
