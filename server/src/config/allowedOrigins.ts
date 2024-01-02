import * as dotenv from 'dotenv';

dotenv.config 
const FRONT:string = process.env.BASE_URL_FRONT as string;
const STORE:string = process.env.BASE_URL_STORE as string;

export const allowedOrigins:string[] = [
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    FRONT,
    STORE
]

