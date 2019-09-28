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
    .put('/', personController.updatePerson.bind(personController))
    .post('/', personController.addPerson.bind(personController));

