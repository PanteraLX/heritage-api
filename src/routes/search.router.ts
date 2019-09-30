import * as express from 'express';
import { UserController } from '../controllers/user.controller';
import { ArangoDatabase } from '../database/arango';
import { SearchService } from '../services/search.service';
import { SearchController } from '../controllers/search.controller';
import { UserService } from '../services/user.service';

const arango = new ArangoDatabase();

const searchService = new SearchService(arango.database);
const searchController = new SearchController(searchService);
const userService = new UserService(arango.database);
const userController = new UserController(userService);

export const searchRouter = express.Router()
    .post('/', userController.isAuthenticated.bind(userController), searchController.search.bind(searchController))
    .get('/', userController.isAuthenticated.bind(userController), searchController.simpleSearch.bind(searchController));
