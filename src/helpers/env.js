import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../../.env');

config({ path: envPath });

export const obj = {
    PORT: Number(process.env.PORT) || 3000,
    USERNAME: process.env.DB_USERNAME || 'postgres',
    HOST: process.env.DB_HOST || process.env.HOST || 'localhost',
    DATABASE: process.env.DB_DATABASE || process.env.DATABASE || 'marketdb',
    PASSWORD: process.env.DB_PASSWORD || process.env.PASSWORD || '',
    PG_PORT: Number(process.env.DB_PORT || process.env.POSTGRES_PORT) || 3060
}

console.log('✓ Environment loaded:', {
    PORT: obj.PORT,
    USERNAME: obj.USERNAME,
    HOST: obj.HOST,
    DATABASE: obj.DATABASE,
    PG_PORT: obj.PG_PORT
});