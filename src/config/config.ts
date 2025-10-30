import { loadEnvFile } from 'node:process';

loadEnvFile('./.env');

const _config = {
    port: process.env.PORT,
};

export const config = Object.freeze(_config)