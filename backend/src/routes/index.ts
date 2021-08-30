import { Router } from 'express';
import rotaComponente from './subroutes/rotaComponente';

const routing = Router();

routing.use('/componente_alergenico', rotaComponente);

export default routing;
