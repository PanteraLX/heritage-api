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

    public async getFamily<T extends IFamily>(person: T | string): Promise<T> {
        if (typeof person === 'string') {
            person = await this.personService.getPerson<T>(person);
            if (!person) {
                throw new Error(`Person mit ID '${person}' wurde nicht gefunden`);
            }
        }
        person.children = await this.getChildren<IFamily>(person);
        person.parents = await this.getParents<IFamily>(person);
        person.partners = await this.getPartners<IFamily>(person);
        return person;
    }

    public async getChildren<T extends IPerson>(person: T | string): Promise<T[]> {
        if (typeof person === 'string') {
            person = await this.personService.getPerson<T>(person);
            if (!person) {
                throw new Error(`Person mit ID '${person}' wurde nicht gefunden`);
            }
        }

        const query: GeneratedAqlQuery = aql`
            FOR vertex IN 1..1 OUTBOUND ${person} ${this.parentHoodCollection}
                RETURN vertex`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.all();
    }

    public async getDescendants<T extends IFamily>(person: T | string): Promise<T> {
        if (typeof person === 'string') {
            person = await this.personService.getPerson<T>(person);
            if (!person) {
                throw new Error(`Person mit ID '${person}' wurde nicht gefunden`);
            }
        }
        const directDescendants: IFamily[] = await this.getChildren<IFamily>(person);
        const childrenPromises: Promise<IFamily>[] = directDescendants
            .map((child: IFamily): Promise<IFamily> => this.getDescendants<IFamily>(child));
        person.children = await Promise.all(childrenPromises);
        return person;
    }

    public async getParents<T extends IPerson>(person: T | string): Promise<T[]> {
        if (typeof person === 'string') {
            person = await this.personService.getPerson<T>(person);
            if (!person) {
                throw new Error(`Person mit ID '${person}' wurde nicht gefunden`);
            }
        }
        const query: GeneratedAqlQuery = aql`
            FOR vertex IN 1..1 INBOUND ${person} ${this.parentHoodCollection}
                RETURN vertex`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.all();
    }

    public async getAncestors<T extends IFamily>(person: T | string): Promise<T> {
        if (typeof person === 'string') {
            person = await this.personService.getPerson<T>(person);
            if (!person) {
                throw new Error(`Person mit ID '${person}' wurde nicht gefunden`);
            }
        }
        const directAncestors: IFamily[] = await this.getChildren<IFamily>(person);
        const patentsPromise: Promise<IFamily>[] = directAncestors
            .map((child: IFamily): Promise<IFamily> => this.getAncestors<IFamily>(child));
        person.parents = await Promise.all(patentsPromise);
        return person;
    }

    public async getPartners<T extends IPerson>(person: T | string): Promise<T[]> {
        if (typeof person === 'string') {
            person = await this.personService.getPerson<T>(person);
            if (!person) {
                throw new Error(`Person mit ID '${person}' wurde nicht gefunden`);
            }
        }
        const query: GeneratedAqlQuery = aql`
            FOR vertex IN 1..1 ANY ${person} ${this.marriageCollection}
                RETURN vertex`;
        const cursor: ArrayCursor = await this.database.query(query);
        return await cursor.all();
    }
}
