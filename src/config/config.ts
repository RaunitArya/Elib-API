import { loadEnvFile } from 'node:process';

loadEnvFile('./.env');

const _config = {
    port: process.env.PORT,
    mongodb: process.env.MONGODB_URI,
    env: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    cloudinaryCloud: process.env.CLOUDINARY_CLOUD,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinarySecret: process.env.CLOUDINARY_SECRET,
};

export const config = Object.freeze(_config);