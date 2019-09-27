import { aql, Database, DocumentCollection } from 'arangojs';
import { GeneratedAqlQuery } from 'arangojs/lib/cjs/aql-query';
import { ArrayCursor } from 'arangojs/lib/cjs/cursor';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';


import { IUser } from '../models/user';

export class UserService {

    private readonly collection: DocumentCollection;

    constructor(private database: Database) {
        this.collection = this.database.collection('users');
    }

    public async authenticate({username, password}: IUser) {
        const user: IUser = await this.getUser(username);
        if (user && bcrypt.compareSync(password, user.password)) {
            const {password, ...userWithoutHash} = user;
            const token = jwt.sign(user._key, process.env.SECRET);
            return {
                ...userWithoutHash,
                token
            };
        }
    }

    public async getUser(username: string): Promise<IUser> {
        const query: GeneratedAqlQuery = aql`
      FOR doc IN ${this.collection}
        FILTER doc.username == ${username}
        RETURN doc`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.next();
    }

    public async getUsers(): Promise<IUser[]> {
        const query: GeneratedAqlQuery = aql`
      FOR doc IN ${this.collection}
        RETURN doc`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.all();
    }

    public async addUser(user: IUser): Promise<IUser> {

        // validate
        if (await this.getUser(user.username)) {
            throw 'Username "' + user.username + '" wird bereits benutzt';
        }
        // hash password
        if (user.password) {
            if (user.password.length <= 8) {
                throw 'Passwort ist zu kurz (mind. 6 Zeichen)';
            }
            user.password = bcrypt.hashSync(user.password, 10);
        }
        // save user

        const query: GeneratedAqlQuery = aql`INSERT ${user} INTO ${this.collection}`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.next();
    }

    public async updateUser(user: IUser): Promise<IUser> {
        const query: GeneratedAqlQuery = aql`UPDATE ${user._key} WITH ${user} IN ${this.collection}`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.next();
    }
}

