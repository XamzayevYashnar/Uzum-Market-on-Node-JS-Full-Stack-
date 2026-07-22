import express from "express";
import { globalErrorHandler } from "../middleware/globalErrorHandler.js";
import { obj } from "../helpers/env.js";
import router from "../router/index.route.js";
import usersController from "../controller/users.controller.js";
import postsController from "../controller/posts.controller.js";
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extends: true}));
app.use('/api', router);

app.use(globalErrorHandler);

app.listen(obj.PORT, async () => {
    console.log(`Server is running on port ${obj.PORT}`);
    try {
        await usersController.createTable();
        await postsController.createTable();
    } catch (error) {
        console.error('Error creating tables:', error.message);
    }
});