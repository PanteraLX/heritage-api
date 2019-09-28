import * as express from 'express';
import { ArangoDatabase } from '../database/arango';
import { FamilyService } from '../services/family.service';
import { PersonService } from '../services/person.service';
import { FamilyController } from '../controllers/family.controller';

const arango = new ArangoDatabase();

const personService = new PersonService(arango.database);
const familyService = new FamilyService(arango.database, personService);
const familyController = new FamilyController(familyService);

export const familyRouter = express.Router()
    .get('/:key', familyController.getFamily.bind(familyController))
    .get('/children/:key', familyController.getChildren.bind(familyController))
    .get('/descendants/:key', familyController.getDescendants.bind(familyController))
    .get('/parents/:key', familyController.getParents.bind(familyController))
    .get('/ancestors/:key', familyController.getAncestors.bind(familyController))
    .get('/partners/:key', familyController.getPartners.bind(familyController));
