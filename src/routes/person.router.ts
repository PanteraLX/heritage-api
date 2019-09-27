import * as express from 'express';
import { ArangoDatabase } from '../database/arango';
import { PersonService } from '../services/person.service';
import { PersonController } from '../controllers/person.controller';

const arango = new ArangoDatabase();

const personService = new PersonService(arango.database);
const personController = new PersonController(personService);

export const personRouter = express.Router()
    .get('/:key', personController.getPerson.bind(personController))
    .get('/', personController.getPersons.bind(personController))
    .post('/', personController.updatePerson.bind(personController));
