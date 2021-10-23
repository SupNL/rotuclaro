// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = [
    {
        name: 'default',
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: process.env.SYNCHRONIZE_DB !== 'false',
        logging: false,
        entities: ['src/model/**/*.ts'],
        migrations: ['src/database/migration/**/*.ts'],
        subscribers: ['src/database/subscriber/**/*.ts'],
        cli: {
            entitiesDir: 'src/model',
            migrationsDir: 'src/database/migration',
            subscribersDir: 'src/database/subscriber',
        },
        ssl: true,
        extra: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    },
];
