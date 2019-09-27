import { Database } from 'arangojs';

export class ArangoDatabase {

    private _database: Database;

    constructor() {
        const db = new Database();
        db.useDatabase(process.env.DB_DATABASE);
        db.useBasicAuth(process.env.DB_USER, process.env.DB_PASS);
        this._database = db;
    }

    public get database(): Database {
        return this._database;
    }

    public set database(value: Database) {
        this._database = value;
    }
}
