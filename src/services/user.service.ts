import { aql, Database, DocumentCollection } from 'arangojs';
import { GeneratedAqlQuery } from 'arangojs/lib/cjs/aql-query';
import { ArrayCursor } from 'arangojs/lib/cjs/cursor';
import { IUser } from '../models/user';

export class UserService {

  private readonly collection: DocumentCollection;

  constructor(private database: Database) {
    this.collection = this.database.collection('users');
  }

  public async getUser(username: string): Promise<IUser> {
    const query: GeneratedAqlQuery = aql`
      FOR doc IN ${this.collection}
        FILTER doc.username == ${username}
        RETURN doc`;
    const cursor: ArrayCursor = await this.database.query(query);
    return await cursor.next();
  }

  public async getUsers(): Promise<IUser[]> {
    const query: GeneratedAqlQuery = aql`
      FOR doc IN ${this.collection}
        RETURN doc`;
    const cursor: ArrayCursor = await this.database.query(query);
    return await cursor.all();
  }

  public async addUser(user: IUser): Promise<IUser> {
    const query: GeneratedAqlQuery = aql`INSERT ${user} INTO ${this.collection}`;
    const cursor: ArrayCursor = await this.database.query(query);
    return await cursor.next();
  }

  public async updateUser(user: IUser): Promise<IUser> {
    const query: GeneratedAqlQuery = aql`UPDATE ${user._key} WITH ${user} IN ${this.collection}`;
    const cursor: ArrayCursor = await this.database.query(query);
    return await cursor.next();
  }
}

