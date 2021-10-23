import 'reflect-metadata';
import { createConnection } from 'typeorm';
import app from './app';
import checkForAdmin from './utils/checkForAdmin';

require('dotenv').config();

createConnection().then(() => {
    checkForAdmin().then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Servidor iniciado');
        });
    });
});

