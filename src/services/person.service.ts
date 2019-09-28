import { aql, Database, DocumentCollection } from 'arangojs';
import { GeneratedAqlQuery } from 'arangojs/lib/cjs/aql-query';
import { ArrayCursor } from 'arangojs/lib/cjs/cursor';
import { IPerson } from '../models/person';

export class PersonService {

    private readonly collection: DocumentCollection;

    constructor(private database: Database) {
        this.collection = this.database.collection('persons');
    }

    public async getPerson<T extends IPerson>(key: string): Promise<T> {
        key = key.replace('persons/', '');

        const query: GeneratedAqlQuery = aql`
            FOR doc IN ${this.collection}
                FILTER doc._key == ${key}
                RETURN doc`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.next();
    }

    public async getPersons<T extends IPerson>(options: { limit: number, offset: number }): Promise<T[]> {
        const query: GeneratedAqlQuery = aql`
            FOR doc IN ${this.collection}
                LIMIT ${options.offset}, ${options.limit}
                RETURN doc`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.all();
    }

    public async updatePerson<T extends IPerson>(person: T): Promise<T> {
        const query: GeneratedAqlQuery = aql`
            UPDATE ${person._key} WITH ${person} IN ${this.collection}`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.next();
    }

    public async addPerson<T extends IPerson>(person: T): Promise<T> {
        const query: GeneratedAqlQuery = aql`
            INSERT ${person} INTO ${this.collection}`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.next();
    }
}

