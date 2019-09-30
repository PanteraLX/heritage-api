import * as express from 'express';
import { UserController } from '../controllers/user.controller';
import { ArangoDatabase } from '../database/arango';
import { FamilyService } from '../services/family.service';
import { PersonService } from '../services/person.service';
import { FamilyController } from '../controllers/family.controller';
import { UserService } from '../services/user.service';

const arango = new ArangoDatabase();

const personService = new PersonService(arango.database);
const familyService = new FamilyService(arango.database, personService);
const familyController = new FamilyController(familyService);
const userService = new UserService(arango.database);
const userController = new UserController(userService);

export const familyRouter = express.Router()
    .get('/:key', userController.isAuthenticated.bind(userController), familyController.getFamily.bind(familyController))
    .get('/children/:key', userController.isAuthenticated.bind(userController), familyController.getChildren.bind(familyController))
    .get('/descendants/:key', userController.isAuthenticated.bind(userController), familyController.getDescendants.bind(familyController))
    .get('/parents/:key', userController.isAuthenticated.bind(userController), familyController.getParents.bind(familyController))
    .get('/ancestors/:key', userController.isAuthenticated.bind(userController), familyController.getAncestors.bind(familyController))
    .get('/partners/:key', userController.isAuthenticated.bind(userController), familyController.getPartners.bind(familyController))
    .post('/parentHood/:key', userController.isAuthenticated.bind(userController), familyController.addParentHood.bind(familyController))
    .post('/marriage/:key', userController.isAuthenticated.bind(userController), familyController.addMarriage.bind(familyController));
