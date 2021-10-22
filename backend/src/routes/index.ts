import { Router } from 'express';
import { expectAdmin } from '../middleware/expectAdmin';
import { requireAuth } from '../middleware/requireAuth';
import rotaComponente from './subroutes/rotaComponente';
import rotaPerfil from './subroutes/rotaPerfil';
import rotaProduto from './subroutes/rotaProduto';
import rotaRelatorio from './subroutes/rotaRelatorio';
import rotaSessao from './subroutes/rotaSessao';
import rotaSugestao from './subroutes/rotaSugestao';
import rotaUsuario from './subroutes/rotaUsuario';

const routing = Router();

routing.use('/componente_alergenico', requireAuth, rotaComponente);
routing.use('/produto', requireAuth, rotaProduto);
routing.use('/usuario', rotaUsuario);
routing.use('/perfil', rotaPerfil);
routing.use('/sessao', rotaSessao);
routing.use('/sugestao', requireAuth, rotaSugestao);
routing.use('/relatorio', requireAuth, expectAdmin, rotaRelatorio);

export default routing;
