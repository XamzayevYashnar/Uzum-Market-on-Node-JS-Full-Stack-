import { Router } from "express";
import usersController from "../controller/users.controller.js";
import { asyncCatch } from "../middleware/asyncCatch.js";
import { checkAuth } from "../helpers/checkAuth.js";

const router = new Router();

router
    .post('/login', checkAuth, asyncCatch(usersController.findByUsernameAndPassword))

    .get('/', asyncCatch(usersController.findAll))
    .get('/:id', asyncCatch(usersController.findOne))
    .post('/', asyncCatch(usersController.addTable))
    .put('/', asyncCatch(usersController.updateTable))
    .delete('/', asyncCatch(usersController.deleteTable));

export default router;