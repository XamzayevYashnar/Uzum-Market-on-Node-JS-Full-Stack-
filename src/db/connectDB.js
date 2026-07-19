import { Pool } from "pg";
import { obj } from "../helpers/env.js";

export const pool = new Pool({
    user: obj.USERNAME,
    host: obj.HOST,
    database: obj.DATABASE,
    password: obj.PASSWORD,
    port: obj.PG_PORT
})

pool.on('error', (err) => {
    console.error('✗ Unexpected error on idle client:', err.message, err.code);
});