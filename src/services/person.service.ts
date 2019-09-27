import { aql, Database, DocumentCollection } from 'arangojs';
import { GeneratedAqlQuery } from 'arangojs/lib/cjs/aql-query';
import { ArrayCursor } from 'arangojs/lib/cjs/cursor';
import { IPerson } from '../models/person';

export class PersonService {

    private readonly collection: DocumentCollection;

    constructor(private database: Database) {
        this.collection = this.database.collection('persons');
    }

    public async getPerson(key: string): Promise<IPerson> {
        key = key.replace('persons/', '');

        const query: GeneratedAqlQuery = aql`
      FOR doc IN ${this.collection}
        FILTER doc._key == ${key}
        RETURN doc`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.next();
    }

    public async getPersons(options: { limit: number, offset: number }): Promise<IPerson[]> {
        const query: GeneratedAqlQuery = aql`
      FOR doc IN ${this.collection}
        LIMIT ${options.offset}, ${options.limit}
        RETURN doc`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.all();
    }

    public async updatePerson(user: IPerson): Promise<IPerson> {
        const query: GeneratedAqlQuery = aql`UPDATE ${user._key} WITH ${user} IN ${this.collection}`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.next();
    }
}

