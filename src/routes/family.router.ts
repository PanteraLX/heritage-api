import * as express from 'express';
import { ChildrenController } from '../controllers/children.controller';
import { ParentsController } from '../controllers/parents.controller';
import { PartnersController } from '../controllers/partners.controller';

import { database } from '../database/arango';
import { ChildrenService } from '../services/children.service';
import { ParentsService } from '../services/parents.service';
import { PartnersService } from '../services/partners.service';
import { PersonService } from '../services/person.service';

const db = database();

const personService = new PersonService(db);
const childrenService = new ChildrenService(db, personService);
const childrenController = new ChildrenController(childrenService);
const parentsService = new ParentsService(db, personService);
const parentsController = new ParentsController(parentsService);
const partnersService = new PartnersService(db, personService);
const partnersController = new PartnersController(partnersService);

export const familyRouter = express.Router()
    .get('/children/:key', childrenController.getChildren.bind(childrenController))
    .get('/parents/:key', parentsController.getParents.bind(parentsController))
    .get('/partners/:key', partnersController.getParents.bind(partnersController));
