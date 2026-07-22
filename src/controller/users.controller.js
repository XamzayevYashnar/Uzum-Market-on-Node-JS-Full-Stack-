import { ControllerBaseDB } from "./base.controller.js";
import { pool } from "../db/connectDB.js";
import { successFunction } from "../utils/responce-function.js";
import { ApiErrorHandler } from "../utils/ApiError.js";
import fs from 'fs';
import path from 'path';

class UserDB extends ControllerBaseDB {
    async createTable() {
        await this.pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password VARCHAR(15),
                avatar TEXT NULL,
                status boolean default false
            );
        `);
        console.log("✓ Users table ready");
    }

    async updateTable(req, res) {
        const id = req.body.id;
        const fields = req.body;
        
        if (Object.keys(fields).length === 0){
            throw new ApiErrorHandler('Malumot kiritganiz yuq!', 400);
        }

        const setQuery = [];
        const values = [];
        let index = 1;
        const arrowFields = ['username', 'email', 'password', 'avatar'];

        for (const [key, value] of Object.entries(fields)){
            if (arrowFields.includes(key) && value !== undefined){
                setQuery.push(`${key}=$${index}`);
                values.push(value);
                index++;
            }
        }

        values.push(id);
        const queryText = `UPDATE users SET ${setQuery.join(', ')} WHERE id = $${index} RETURNING *;`;
        
        const data = await this.pool.query(queryText, values);

        if (data.rows.length === 0){
            throw new ApiErrorHandler('Incorrect user ID!', 404);
        }
        return successFunction(res, data.rows[0], 'User is success update!');
    }

    async deleteTable(req, res) {
        const id = req.body.id;
        const result = await this.pool.query(`
            SELECT avatar FROM users WHERE id = $1
            `, [id]);
        
        if (result.rows.length > 0 && result.rows[0]){
            const avatarName = result.rows[0].avatar;
            const fullPath = path.join(process.cwd(), 'src', 'media', 'profile_avatars', avatarName)

            if (fs.existsSync(fullPath)){
                await fs.promises.unlink(fullPath)
            }
        }

        await this.pool.query(`DELETE FROM users WHERE id = $1;`, [id]);
        return successFunction(res, { id }, 'Malumot muaffaqiyatli uchdi', 200);
    }

    async addTable(req, res) {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const avatar = req.body.avatar;
        let avatarImagePathForDB = null;

        const existsDataUsername = await this.pool.query(`
            SELECT * FROM users WHERE username = $1;
            `, [username]);

        const existsDataEmail = await this.pool.query(`
            SELECT * FROM users WHERE email = $1;
            `, [email]);

        if (existsDataUsername.rows.length > 0 || existsDataEmail.rows.length > 0){ throw new ApiErrorHandler('Bu username yoki email allaqachon mavjud!') }

        if (avatar){

            const matches = avatar.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
            
            if (!matches || matches.length !== 3){ throw new ApiErrorHandler('Iltimos avatarni Base64 formatig ugirib yuboring!') }

            const MediaDir = path.join(process.cwd(), 'src', 'media', 'profile_avatars');
            const extension = matches[1];
            const imageBuffer = Buffer.from(matches[2], 'base64')

            if (!fs.existsSync(MediaDir)){
                fs.mkdirSync(MediaDir);
            }

            const fileNameAvatar = `img_${Date.now()}_${Math.random() * 1000}.${extension}`;
            const fullPath = path.join(MediaDir, fileNameAvatar);
            fs.writeFileSync(fullPath, imageBuffer);

            avatarImagePathForDB = `media/profile_avatars/${fileNameAvatar}`;
            
            const data = await this.pool.query(
                `INSERT INTO users (username, email, password, avatar) VALUES ($1, $2, $3, $4) RETURNING *;`,
                [username, email, password, avatarImagePathForDB]
            );
            console.log('User muavffaqiyatli yaratildi!');
            return successFunction(res, data.rows, 'Malumot muaffaqiyatli qushildi!', 201);
        }
    }

    async findAll(req, res) {
        const data = await this.pool.query(`SELECT * FROM users;`);
        return successFunction(res, data.rows, 'Malumot joyda!', 200);
    }

    async findOne(req, res) {
        const data = await this.pool.query(`SELECT * FROM users WHERE id = $1;`, [req.params.id]);
        return successFunction(res, data.rows, 'Malumot joyda!', 200);
    }

    async findByUsernameAndPassword(req, res){
        const { username, password } = req.body;

        const data = await this.pool.query(`
            SELECT * FROM users WHERE username = $1
        `, [username]);

        if (data.rows.length === 0) {
            throw new ApiErrorHandler('Username yoki password xato', 404);
        }

        const user = data.rows[0];

        if (user.password !== password){
            throw new ApiErrorHandler('Password yoki username xato', 401);
        }

        const result = await this.pool.query(`
            UPDATE users SET status = true where id = $1 returning *`, [user.id]);
        console.log(result.rows);
        return successFunction(res, user, 'You are finally login!', 200);
    }
}

export default new UserDB(pool);
