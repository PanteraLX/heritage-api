import * as express from 'express';
import { ArangoDatabase } from '../database/arango';
import { SearchService } from '../services/search.service';
import { SearchController } from '../controllers/search.controller';

const arango = new ArangoDatabase();

const searchService = new SearchService(arango.database);
const searchController = new SearchController(searchService);

export const searchRouter = express.Router()
    .post('/', searchController.search.bind(searchController))
    .get('/', searchController.simpleSearch.bind(searchController));
