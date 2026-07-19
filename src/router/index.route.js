import { Router } from "express";
import userRouter from "./user.route.js";
import postRouter from "./posts.route.js";

const router = new Router();

router
    .use('/users', userRouter)
    .use('/posts', postRouter)

export default router