import { Database, EdgeCollection } from 'arangojs';
import { IPerson } from '../models/person';
import { PersonService } from './person.service';

export class ParentsService {

  private readonly collection: EdgeCollection;

  constructor(private database: Database, private personService: PersonService) {
    this.collection = this.database.edgeCollection('parentHood');
  }

  public async getParents(key: string): Promise<IPerson[]> {
    const person: IPerson = await this.personService.getPerson(key);
    const edges: any[] = await this.collection.inEdges(person);
    const mapPerson = async (edge: any): Promise<IPerson> => this.personService.getPerson(edge._from);
    const parentPromise: Promise<IPerson>[] = edges.map(mapPerson);
    return Promise.all(parentPromise);
  }

}
