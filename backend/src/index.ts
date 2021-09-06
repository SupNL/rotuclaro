import 'reflect-metadata';
import { createConnection } from 'typeorm';
import app from './app';
import checkForAdmin from './utils/checkForAdmin';

createConnection().then(() => {
    checkForAdmin().then(() => {
        app.listen(3333, () => {
            console.log('Servidor iniciado');
        });
    });
});

