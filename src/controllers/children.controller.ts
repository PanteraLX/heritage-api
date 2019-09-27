import { Request, Response } from 'express';
import { IPerson } from '../models/person';
import { ChildrenService } from '../services/children.service';

export class ChildrenController {

  constructor(private childrenService: ChildrenService) {
  }

  public async getChildren(req: Request, res: Response): Promise<Response> {
    const key: string = req.params.key || '';
    const children: IPerson[] = await this.childrenService.getChildren(key);
    return res.json(children);
  }
}

