import { Database, EdgeCollection } from 'arangojs';
import { IPerson } from '../models/person';
import { PersonService } from './person.service';

export class PartnersService {

  private readonly collection: EdgeCollection;

  constructor(private database: Database, private personService: PersonService) {
    this.collection = this.database.edgeCollection('marriage');
  }

  public async getPartners(key: string): Promise<IPerson[]> {
    const person: IPerson = await this.personService.getPerson(key);
    const inEdges: any[] = (await this.collection.inEdges(person)).map((edge): string => edge._from);
    const outEdges: any[] = (await this.collection.outEdges(person)).map((edge): string => edge._to);
    console.log(inEdges);
    console.log(outEdges);


    const edges = [...inEdges, ...outEdges];
    const mapPerson = async (edge: any): Promise<IPerson> => this.personService.getPerson(edge);
    const parentPromise: Promise<IPerson>[] = edges.map(mapPerson);
    return Promise.all(parentPromise);
  }

}
