import { Request, Response } from 'express';
import { IPerson } from '../models/person';
import { PartnersService } from '../services/partners.service';

export class PartnersController {

  constructor(private partnersService: PartnersService) {
  }

  public async getParents(req: Request, res: Response): Promise<Response> {
    try {
      const key: string = req.params.key || '';
      const children: IPerson[] = await this.partnersService.getPartners(key);
      return res.json(children);
    } catch (error) {
      res.status(400).json({message: error});
    }
  }
}
