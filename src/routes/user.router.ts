import * as express from 'express';
import { UserController } from '../controllers/user.controller';
import { database } from '../database/arango';
import { UserService } from '../services/user.service';

const db = database();

const userService = new UserService(db);
const userController = new UserController(userService);

export const userRouter = express.Router()
    .post('/authenticate', userController.authenticate.bind(userController))
    .post('/', userController.register.bind(userController))
    .get('/', userController.getUsers.bind(userController))
    .get('/current', userController.getCurrent.bind(userController))
    .get('/:id', userController.getUser.bind(userController))
    .put('/:id', userController.updateUser.bind(userController));
