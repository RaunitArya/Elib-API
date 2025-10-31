import { loadEnvFile } from 'node:process';

loadEnvFile('./.env');

const _config = {
    port: process.env.PORT,
    mongodb: process.env.MONGODB_URI,
    env: process.env.NODE_ENV,
};

export const config = Object.freeze(_config);