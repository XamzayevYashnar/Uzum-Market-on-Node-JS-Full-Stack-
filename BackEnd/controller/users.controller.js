import { ControllerBaseDB } from "./base.controller.js";
import { pool } from "../db/connectDB.js";
import { successFunction } from "../utils/responce-function.js";
import { ApiErrorHandler } from "../utils/ApiError.js";

class UserDB extends ControllerBaseDB {
    async createTable() {
        await this.pool.query(`
            CREATE TABLE IF NOT EXISTS users ( 
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE, 
                password VARCHAR(15)
            );
        `);
        console.log("✓ Users table ready");
    }

    async updateTable(req, res) {
        const id = req.body.id;
        const fields = req.body

        if (Object.keys(fields).length === 0){
            throw new ApiErrorHandler('Malumot kiritganiz yuq!', 400);
        }

        const setQuery = [];
        const values = [];
        const index = 1;

        const arrowFields = ['username', 'email', 'password'];

        for (const [key, value] of Object.entries(fields)){
            if (arrowFields.includes(key) && value !== undefined){
                setQuery.push(`${key}=$${index}`);
                values.push(value);
                index++;
            } 
        }

        values.push(id);
        const queryText = `UPDATE users ${setQuery.join(', ')} WHERE id = $${index} RETURNING *;`
        
        const data = await this.pool.query(setQuery, values)

        if (data.rows.length === 0){
            throw new ApiErrorHandler('Incorrect user ID!', 404);
        }

        return successFunction(res, data, 'User is success update!')
    }

    async deleteTable(req, res) {
        const id = req.body.id;
        await this.pool.query(`DELETE FROM users WHERE id = $1;`, [id]);
        return successFunction(res, { id }, 'Malumot muaffaqiyatli uchdi', 200);
    }

    async addTable(req, res) {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const data = await this.pool.query(
            `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`, 
            [username, email, password]
        );
        console.log('User muavffaqiyatli yaratildi!');
        return successFunction(res, data.rows, 'Malumot muaffaqiyatli qushildi!', 201);
    }

    async findAll(req, res) {
        const data = await this.pool.query(`SELECT * FROM users;`);
        return successFunction(res, data.rows, 'Malumot joyda!', 200);
    }

    async findOne(req, res) {
        const data = await this.pool.query(`SELECT * FROM users WHERE id = $1;`, [req.params.id]);
        return successFunction(res, data.rows, 'Malumot joyda!', 200);
    }
}

export default new UserDB(pool);
