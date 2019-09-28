import { aql, Database, EdgeCollection } from 'arangojs';
import { GeneratedAqlQuery } from 'arangojs/lib/cjs/aql-query';
import { ArrayCursor } from 'arangojs/lib/cjs/cursor';
import { IPerson } from '../models/person';
import { PersonService } from './person.service';

export class ChildrenService {

    private readonly collection: EdgeCollection;

    constructor(private database: Database, private personService: PersonService) {
        this.collection = this.database.edgeCollection('parentHood');
    }

    public async getChildren(key: string): Promise<IPerson[]> {
        const person: IPerson = await this.personService.getPerson(key);
        if (!person) {
            throw new Error(`Person mit ID '${key}' wurde nicht gefunden`);
        }
        const query: GeneratedAqlQuery = aql`
            FOR vertex IN 1..1 OUTBOUND ${person} ${this.collection}
                RETURN vertex`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.all();
    }
}
