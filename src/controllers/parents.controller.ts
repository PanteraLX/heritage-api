import { Request, Response } from 'express';
import { IPerson } from '../models/person';
import { ParentsService } from '../services/parents.service';

export class ParentsController {

  constructor(private parentsService: ParentsService) {
  }

  public async getParents(req: Request, res: Response): Promise<Response> {
      try {
          const key: string = req.params.key || '';
          const children: IPerson[] = await this.parentsService.getParents(key);
          return res.json(children);
      } catch (error) {
          res.status(400).json({message: error.message});
      }
  }
}
