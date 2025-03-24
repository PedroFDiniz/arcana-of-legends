import dotenv from 'dotenv';
import { log } from '../utils/misc';

export default async () => {
    /* Import and check environment variables */
    dotenv.config();
    const REQUIRED_ENV_VARIABLES = [
        'NODE_ENV',
        'DB_DEV',
        'DB_PROD',
        'PORT',
        'SALT_ROUNDS',
        'JWT_SECRET',
        'BASE_ADDRESS',
    ];

    for (let variable of REQUIRED_ENV_VARIABLES) {
        if (!(variable in process.env)){
            const message = `Missing environment variable: ${variable}.`;
            log(message);
            throw new Error(message);
        }
    }
}

const environment: string   = `${process.env.NODE_ENV}`;
const jwt_secret: string    = `${process.env.JWT_SECRET}`;
const port: string          = `${process.env.PORT}`;
const salt_rounds: string   = `${process.env.SALT_ROUNDS}`;
const base_address: string  = `${process.env.BASE_ADDRESS}`;

export { environment, jwt_secret, port, salt_rounds, base_address };