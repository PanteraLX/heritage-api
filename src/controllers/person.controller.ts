import { Request, Response } from 'express';
import { IPerson } from '../models/person';
import { IUser } from '../models/user';
import { PersonService } from '../services/person.service';

export class PersonController {

  constructor(private personService: PersonService) {
  }

  public async getPerson(req: Request, res: Response): Promise<Response> {
    try {
      const key: string = req.params.key || '';
      const person: IPerson = await this.personService.getPerson(key);
      return res.json(person);
    } catch (error) {
      res.status(400).json({message: error});
    }
  }

  public async getPersons(req: Request, res: Response): Promise<Response> {
    try {
      const limit = Number.parseInt(req.query.limit || null, 10);
      const offset = Number.parseInt(req.query.offset || 0, 10);
      const persons: IPerson[] = await this.personService.getPersons({limit, offset});
      return res.json(persons);
    } catch (error) {
      res.status(400).json({message: error});
    }
  }

  public async updatePerson(req: Request, res: Response): Promise<Response> {
    try {
      const body: IPerson = req.body;
      const person: IPerson = await this.personService.updatePerson(body);
      return res.json(person);
    } catch (error) {
      res.status(400).json({message: error});
    }
  }
}

