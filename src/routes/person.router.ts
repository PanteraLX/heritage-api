import * as express from 'express';
import { UserController } from '../controllers/user.controller';
import { ArangoDatabase } from '../database/arango';
import { PersonService } from '../services/person.service';
import { PersonController } from '../controllers/person.controller';
import { UserService } from '../services/user.service';

const arango = new ArangoDatabase();

const personService = new PersonService(arango.database);
const personController = new PersonController(personService);
const userService = new UserService(arango.database);
const userController = new UserController(userService);

export const personRouter = express.Router()
    .get('/:key', userController.isAuthenticated.bind(userController), personController.getPerson.bind(personController))
    .get('/', userController.isAuthenticated.bind(userController), personController.getPersons.bind(personController))
    .post('/', userController.isAuthenticated.bind(userController), personController.getPersonsByQuery.bind(personController))
    .put('/', userController.isAuthenticated.bind(userController), personController.updatePerson.bind(personController))
    .post('/', userController.isAuthenticated.bind(userController), personController.addPerson.bind(personController));

