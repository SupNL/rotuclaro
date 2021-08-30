import express from 'express';
import cors from 'cors';
import routing from './routes';
import { errors } from 'celebrate';

const app = express();

app.use(
    cors({
        origin: '*',
    })
);
app.use(express.json());
app.use('/', routing);
app.use(errors());
app.use((req, res) => {
    res.status(404).send('Não encontrado');
});

export default app;
