import { Database, EdgeCollection } from 'arangojs';
import { IPerson } from '../models/person';
import { PersonService } from './person.service';

export class ChildrenService {

  private readonly collection: EdgeCollection;

  constructor(private database: Database, private personService: PersonService) {
    this.collection = this.database.edgeCollection('parentHood');
  }

  public async getChildren(key: string): Promise<IPerson[]> {
    const person: IPerson = await this.personService.getPerson(key);
    const edges: any[] = await this.collection.outEdges(person);
    const mapPerson = async (edge: any): Promise<IPerson> => await this.personService.getPerson(edge._to);
    const childrenPromise: Promise<IPerson>[] = edges.map(mapPerson);
    return Promise.all(childrenPromise);
  }
}
