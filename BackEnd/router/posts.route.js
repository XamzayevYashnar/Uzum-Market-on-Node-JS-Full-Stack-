import { Router } from "express";
import postsController from "../controller/posts.controller.js";
import { asyncCatch } from "../middleware/asyncCatch.js";

const router = new Router();

router
    .get('/', asyncCatch(postsController.findAll))
    .get('/:id', asyncCatch(postsController.findOne))
    .post('/', asyncCatch(postsController.addTable))
    .put('/:id', asyncCatch(postsController.updateTable))
    .delete('/', asyncCatch(postsController.deleteTable))

export default router;