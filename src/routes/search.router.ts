import * as express from 'express';
import { database } from '../database/arango';
import { SearchService } from '../services/search.service';
import { SearchController } from '../controllers/search.controller';

const db = database();

const searchService = new SearchService(db);
const searchController = new SearchController(searchService);

export const searchRouter = express.Router()
    .post('/', searchController.search.bind(searchController))
    .get('/', searchController.simpleSearch.bind(searchController));
