import { Database } from 'arangojs';

const db = new Database();
db.useDatabase(process.env.DB_DATABASE);
db.useBasicAuth(process.env.DB_USER, process.env.DB_PASS);

export const database = db;
