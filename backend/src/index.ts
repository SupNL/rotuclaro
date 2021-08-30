import 'reflect-metadata';
import { createConnection } from 'typeorm';
import app from './app';

createConnection().then(() => {
    app.listen(3333, () => {
        console.log('Servidor iniciado');
    });
});

