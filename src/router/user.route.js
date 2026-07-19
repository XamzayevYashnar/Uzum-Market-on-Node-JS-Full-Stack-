import { Router } from "express";
import usersController from "../controller/users.controller.js";
import { asyncCatch } from "../middleware/asyncCatch.js";

const router = new Router();

router
    .get('/', asyncCatch(usersController.findAll))
    .get('/:id', asyncCatch(usersController.findOne))
    .post('/', asyncCatch(usersController.addTable))
    .put('/', asyncCatch(usersController.updateTable))
    .post('/login', asyncCatch(usersController.findByUsernameAndPassword))
    .delete('/', asyncCatch(usersController.deleteTable));

export default router;