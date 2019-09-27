import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';

import { Express } from 'express-serve-static-core';

import { familyRouter } from './routes/family.router';
import { personRouter } from './routes/person.router';
import { searchRouter } from './routes/search.router';

export class App {

    private readonly _express: Express;

    public get express(): Express {
        return this._express;
    }

    constructor() {
        this._express = express();
        this.mountMiddleware();
        this.mountRoutes();
    }

    private mountMiddleware() {
        this._express.use(cors());
        this._express.use(bodyParser.json());
        this._express.use(logger('dev'));
        this._express.use(express.json());
        this._express.use(express.urlencoded({extended: false}));
        this._express.use(cookieParser());
    }

    private mountRoutes(): void {
        this._express.use('/search', searchRouter);
        this._express.use('/person', personRouter);
        this._express.use('/family', familyRouter);
    }
}
