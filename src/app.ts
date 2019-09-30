import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as compression from 'compression';
import * as helmet from 'helmet';

import { Express } from 'express-serve-static-core';

import { familyRouter } from './routes/family.router';
import { personRouter } from './routes/person.router';
import { searchRouter } from './routes/search.router';
import { userRouter } from './routes/user.router';

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
        this.express.use(compression());
        //this.express.use(helmet());
        this.express.use(helmet.hidePoweredBy({ setTo: 'PHP 5.3.0' }));
        this.express.use(cors());
        this.express.use(bodyParser.json());
        this.express.use(logger('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({extended: false}));
        this.express.use(cookieParser());
    }

    private mountRoutes(): void {
        this.express.use('/search', searchRouter);
        this.express.use('/person', personRouter);
        this.express.use('/family', familyRouter);
        this.express.use('/user', userRouter);
    }
}
