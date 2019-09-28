import { aql, Database, EdgeCollection } from 'arangojs';
import { GeneratedAqlQuery } from 'arangojs/lib/cjs/aql-query';
import { DocumentHandle } from 'arangojs/lib/cjs/collection';
import { ArrayCursor } from 'arangojs/lib/cjs/cursor';
import { IFamily } from '../models/family';
import { IPerson } from '../models/person';
import { IUser } from '../models/user';
import { PersonService } from './person.service';

export class FamilyService {

    private readonly parentHoodCollection: EdgeCollection;
    private readonly marriageCollection: EdgeCollection;

    constructor(private database: Database, private personService: PersonService) {
        this.parentHoodCollection = this.database.edgeCollection('parentHood');
        this.marriageCollection = this.database.edgeCollection('marriage');
    }

    public async getFamily<T extends IFamily>(key: string, person?: T): Promise<T> {
        person = person || await this.personService.getPerson<T>(key);
        if (!person) {
            throw new Error(`Person mit ID '${key}' wurde nicht gefunden`);
        }
        person.children = await this.getChildren<IFamily>(key, person);
        person.parents = await this.getParents<IFamily>(key, person);
        person.partners = await this.getPartners<IFamily>(key, person);
        return person;
    }

    public async getParents<T extends IPerson>(key: string, person?: T): Promise<T[]> {
        person = person || await this.personService.getPerson<T>(key);
        if (!person) {
            throw new Error(`Person mit ID '${key}' wurde nicht gefunden`);
        }
        const query: GeneratedAqlQuery = aql`
            FOR vertex IN 1..1 INBOUND ${person} ${this.parentHoodCollection}
                RETURN vertex`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.all();
    }

    public async getChildren<T extends IPerson>(key: string, person?: T): Promise<T[]> {
        person = person || await this.personService.getPerson<T>(key);
        if (!person) {
            throw new Error(`Person mit ID '${key}' wurde nicht gefunden`);
        }
        const query: GeneratedAqlQuery = aql`
            FOR vertex IN 1..1 OUTBOUND ${person} ${this.parentHoodCollection}
                RETURN vertex`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.all();
    }

    public async getPartners<T extends IPerson>(key: string, person?: T): Promise<T[]> {
        person = person || await this.personService.getPerson<T>(key);
        if (!person) {
            throw new Error(`Person mit ID '${key}' wurde nicht gefunden`);
        }
        const query: GeneratedAqlQuery = aql`
            FOR vertex IN 1..1 ANY ${person} ${this.marriageCollection}
                RETURN vertex`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.all();
    }
}
