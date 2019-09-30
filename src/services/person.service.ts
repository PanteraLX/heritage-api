import { aql, Database, DocumentCollection } from 'arangojs';
import { GeneratedAqlQuery } from 'arangojs/lib/cjs/aql-query';
import { ArrayCursor } from 'arangojs/lib/cjs/cursor';
import { IPerson } from '../models/person';

export interface DataTablesResponse<T> {
    data: T[];
    draw: number;
    recordsFiltered: number;
    recordsTotal: number;
}

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

    public async getPersons<T extends IPerson>(): Promise<T[]> {
        const query: GeneratedAqlQuery = aql`
            FOR doc IN ${this.collection}
                RETURN doc`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.all();
    }

    public async getPersonsByQuery<T extends IPerson>(options: any): Promise<DataTablesResponse<T>> {

        const order = {
            column: options.columns.filter((column, index) => index === options.order[0].column).shift().data,
            direction: options.order[0].dir
        };

        const filter = options.search.value ?
            aql.literal(`FILTER doc.givenName == '${options.search.value}' OR doc.surName == '${options.search.value}' OR doc.birthName == '${options.search.value}'`) :
            aql.literal('');

        const selectedUsersQuery: GeneratedAqlQuery = aql`
            FOR doc IN ${this.collection}
                ${filter}
                SORT doc.${order.column} ${order.direction}
                LIMIT ${options.start}, ${options.length}
                RETURN doc`;
        const selectedUsersCursor: ArrayCursor = await this.database.query(selectedUsersQuery);
        const selectedUsers = await selectedUsersCursor.all();

        const personCount = await this.getPersonCount();

        return {data: selectedUsers, draw: options.draw, recordsFiltered: personCount, recordsTotal: personCount};

    }

    private async getPersonCount(): Promise<number> {
        const personCountQuery: GeneratedAqlQuery = aql`
                RETURN LENGTH(${this.collection})`;
        const personCountCursor: ArrayCursor = await this.database.query(personCountQuery);
        return await personCountCursor.next();
    }

    public async updatePerson<T extends IPerson>(person: T): Promise<T> {
        const query: GeneratedAqlQuery = aql`
            UPDATE ${person._key} WITH ${person} IN ${this.collection}`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.next();
    }

    public async addPerson<T extends IPerson>(person: T): Promise<T> {
        const query: GeneratedAqlQuery = aql`
            INSERT ${person} INTO ${this.collection}
            RETURN NEW`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.next();
    }
}

