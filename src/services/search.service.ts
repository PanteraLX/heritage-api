import { aql, Database } from 'arangojs';
import { GeneratedAqlQuery } from 'arangojs/lib/cjs/aql-query';
import { ArrayCursor } from 'arangojs/lib/cjs/cursor';
import { ArangoSearchView } from 'arangojs/lib/cjs/view';
import { IPerson } from '../models/person';

export class SearchService {

  private readonly collection: ArangoSearchView;

  constructor(private database: Database) {
    this.collection = this.database.arangoSearchView('name');
  }

  public async search(body: any): Promise<IPerson[]> {

    const query: GeneratedAqlQuery = aql`
      FOR doc IN name
        SEARCH ANALYZER(PHRASE(doc.givenName, ${body.givenName}) AND PHRASE(doc.surName, ${body.surName}), "text_de")
        RETURN doc`;
    const cursor: ArrayCursor = await this.database.query(query);
    return await cursor.all();
  }

  public async simpleSearch(params: string): Promise<IPerson[]> {
    const [givenName, surName] = params.trim().split(' ');
    let query: GeneratedAqlQuery;
    if (givenName && surName) {
      query = aql`
      FOR doc IN name
        SEARCH ANALYZER(
          (PHRASE(doc.givenName, ${givenName})
            AND PHRASE(doc.surName, ${surName}))
          OR (PHRASE(doc.givenName, ${surName})
            AND PHRASE(doc.surName, ${givenName}))
          (PHRASE(doc.givenName, ${givenName})
            AND PHRASE(doc.birthName, ${surName}))
          OR (PHRASE(doc.givenName, ${surName})
            AND PHRASE(doc.birthName, ${givenName}))
          , "text_de")
        RETURN doc`;
    } else if (givenName) {
      query = aql`
      FOR doc IN name
        SEARCH ANALYZER(PHRASE(doc.givenName, ${givenName}) OR PHRASE(doc.surName, ${givenName}), "text_de")
        RETURN doc`;
    }
    const cursor: ArrayCursor = await this.database.query(query);
    return await cursor.all();
  }
}
