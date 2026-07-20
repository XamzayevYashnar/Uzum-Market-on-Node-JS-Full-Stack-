import { ControllerBaseDB } from "./base.controller.js"; 
import { successFunction } from "../utils/responce-function.js"; 
import { pool } from "../db/connectDB.js"; 
import fs from 'fs'; 
import path from "path"; 
import { ApiErrorHandler } from "../utils/ApiError.js"; 

class PostsDB extends ControllerBaseDB { 
    async createTable() { 
        await this.pool.query(` 
            CREATE TABLE IF NOT EXISTS posts ( 
                id SERIAL PRIMARY KEY, 
                title VARCHAR(20), 
                image TEXT, 
                description TEXT, 
                price DECIMAL (10, 2), 
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE 
            ); 
        `); 
        console.log("✓ Posts table ready"); 
    } 

    async addTable(req, res) { 
        const { title, description, price, image, user_id } = req.body;
        let imagePathForDB = null; 

        if (image) { 
            const matches = image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/); 
            if (!matches || matches.length !== 3) { 
                throw new ApiErrorHandler('Notug\'ri rasm formati, Base64 formati kutilmoqda!', 400); 
            } 
            const extension = matches[1]; 
            const imageBuffer = Buffer.from(matches[2], 'base64'); 
            const mediaDir = path.join(process.cwd(), 'src', 'media', 'posts'); 

            if (!fs.existsSync(mediaDir)) { 
                fs.mkdirSync(mediaDir, { recursive: true }); 
            } 

            const fileName = `img_${Date.now()}_${Math.floor(Math.random() * 1000)}.${extension}`; 
            const fullPath = path.join(mediaDir, fileName); 
            fs.writeFileSync(fullPath, imageBuffer); 
            imagePathForDB = `media/${fileName}`; 
        } 

        const data = await this.pool.query( 
            `INSERT INTO posts (title, description, price, image, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`, 
            [title, description, price, imagePathForDB, user_id] 
        ); 

        return successFunction(res, data.rows[0], 'Post muaffaqiyatli yaratildi!', 201); 
    } 

    async deleteTable(req, res) { 
        const id = req.body.id; 
        
        const post = await this.pool.query(`SELECT image FROM posts WHERE id = $1;`, [id]);
        if (post.rows.length > 0 && post.rows[0].image) {
            const fullPath = path.join(process.cwd(), post.rows[0].image);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }

        await this.pool.query(`DELETE FROM posts WHERE id = $1;`, [id]); 
        return successFunction(res, { id }, 'Post muaffaqiyatli uchdi!', 200); 
    } 

    async findAll(req, res) { 
        const data = await this.pool.query(`SELECT * FROM posts;`); 
        return successFunction(res, data.rows, 'Malumot joyda!', 200); 
    } 

    async findOne(req, res) { 
        const data = await this.pool.query(`SELECT * FROM posts WHERE id = $1;`, [req.params.id]); 
        if (data.rows.length === 0) {
            return res.status(404).json({ message: "Post topilmadi" });
        }
        return successFunction(res, data.rows[0], 'Malumot joyda!', 200); 
    } 

    async updateTable(req, res) { 
        const id = req.params.id; 
        const fields = req.body; 

        if (Object.keys(fields).length === 0) { 
            return res.status(400).json({ message: "Yangliash uchun malumot yuq" }); 
        } 

        const setQuery = []; 
        const values = []; 
        let index = 1; 
        const allowedFields = ['title', 'description', 'price', 'image', 'user_id']; 

        for (const [key, value] of Object.entries(fields)) { 
            if (allowedFields.includes(key) && value !== undefined) { 
                setQuery.push(`${key}=$${index}`); 
                values.push(value); 
                index++; 
            } 
        } 

        values.push(id); 
        const queryText = `UPDATE posts SET ${setQuery.join(', ')} WHERE id = $${index} RETURNING *`; 
        const data = await this.pool.query(queryText, values); 

        if (data.rows.length === 0) { 
            return res.status(404).json({ message: "Post topilmadi" }); 
        } 
        return successFunction(res, data.rows[0], 'Post muvaffaqiyatli yangilandi!', 200); 
    } 
} 

export default new PostsDB(pool);