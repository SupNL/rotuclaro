import { Router } from 'express';
import rotaComponente from './subroutes/rotaComponente';
import rotaProduto from './subroutes/rotaProduto';

const routing = Router();

routing.use('/componente_alergenico', rotaComponente);
routing.use('/produto', rotaProduto);

export default routing;
