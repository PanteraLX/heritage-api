import * as express from 'express';
import { database } from '../database/arango';
import { SearchService } from '../services/search.service';
import { SearchController } from '../controllers/search.controller';

const searchService = new SearchService(database);
const searchController = new SearchController(searchService);

export const searchRouter = express.Router()
    .post('/', searchController.search.bind(searchController))
    .get('/', searchController.simpleSearch.bind(searchController));
