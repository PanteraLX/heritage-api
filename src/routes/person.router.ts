import * as express from 'express';
import { database } from '../database/arango';
import { PersonService } from '../services/person.service';
import { PersonController } from '../controllers/person.controller';

const db = database();

const personService = new PersonService(db);
const personController = new PersonController(personService);

export const personRouter = express.Router()
    .get('/:key', personController.getPerson.bind(personController))
    .get('/', personController.getPersons.bind(personController))
    .post('/', personController.updatePerson.bind(personController));
