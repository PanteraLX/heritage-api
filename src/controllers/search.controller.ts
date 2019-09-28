import { Request, Response } from 'express';
import { IPerson } from '../models/person';
import { IUser } from '../models/user';
import { SearchService } from '../services/search.service';

export class SearchController {
  constructor(private searchService: SearchService) {
  }

  public async search(req: Request, res: Response): Promise<Response> {
    try {
      const children: IPerson[] = await this.searchService.search(req.body);
      return res.json(children);
    } catch (error) {
      res.status(400).json({message: error.message});
    }
  }

  public async simpleSearch(req: Request, res: Response): Promise<Response> {
    try {
      const query: string = req.query.query || '';
      const persons: IPerson[] = await this.searchService.simpleSearch(query);
      return res.json(persons);
    } catch (error) {
      res.status(400).json({message: error.message});
    }
  }
}
