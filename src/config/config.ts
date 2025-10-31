import { loadEnvFile } from 'node:process';

loadEnvFile('./.env');

const _config = {
    port: process.env.PORT,
    mongodb: process.env.MONGODB_URI,
};

export const config = Object.freeze(_config);