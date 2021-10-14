import express from 'express';
import cors from 'cors';
import routing from './routes';
import { errors } from 'celebrate';
import { serverLimiter } from './middleware/limitRequests';
import { logRequest } from './middleware/logRequest';

const app = express();
app.use(serverLimiter);
app.use(
    cors({
        origin: '*',
    })
);
app.use(express.json());
app.use('/', logRequest, routing);
app.use(errors());
app.use((req, res) => {
    res.status(404).send('Não encontrado');
});

export default app;
