import * as express from 'express';
import { ChildrenController } from '../controllers/children.controller';
import { ParentsController } from '../controllers/parents.controller';
import { PartnersController } from '../controllers/partners.controller';

import { database } from '../database/arango';
import { ChildrenService } from '../services/children.service';
import { ParentsService } from '../services/parents.service';
import { PartnersService } from '../services/partners.service';
import { PersonService } from '../services/person.service';

const personService = new PersonService(database);
const childrenService = new ChildrenService(database, personService);
const childrenController = new ChildrenController(childrenService);
const parentsService = new ParentsService(database, personService);
const parentsController = new ParentsController(parentsService);
const partnersService = new PartnersService(database, personService);
const partnersController = new PartnersController(partnersService);

export const familyRouter = express.Router()
    .get('/children/:key', childrenController.getChildren.bind(childrenController))
    .get('/parents/:key', parentsController.getParents.bind(parentsController))
    .get('/partners/:key', partnersController.getParents.bind(partnersController));
