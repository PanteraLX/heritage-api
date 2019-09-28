import { Request, Response } from 'express';
import { IFamily } from '../models/family';
import { IPerson } from '../models/person';
import { FamilyService } from '../services/family.service';

export class FamilyController {

    constructor(private familyService: FamilyService) {
    }

    public async getFamily(req: Request, res: Response): Promise<Response> {
        try {
            const key: string = req.params.key || '';
            const family: IFamily = await this.familyService.getFamily<IFamily>(key);
            return res.json(family);
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    }

    public async getChildren(req: Request, res: Response): Promise<Response> {
        try {
            const key: string = req.params.key || '';
            const children: IPerson[] = await this.familyService.getChildren<IPerson>(key);
            return res.json(children);
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    }

    public async getDescendants(req: Request, res: Response): Promise<Response> {
        try {
            const key: string = req.params.key || '';
            const descendants: IFamily = await this.familyService.getDescendants<IFamily>(key);
            return res.json(descendants);
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    }

    public async getParents(req: Request, res: Response): Promise<Response> {
        try {
            const key: string = req.params.key || '';
            const children: IPerson[] = await this.familyService.getParents<IPerson>(key);
            return res.json(children);
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    }

    public async getAncestors(req: Request, res: Response): Promise<Response> {
        try {
            const key: string = req.params.key || '';
            const ancestors: IFamily = await this.familyService.getAncestors<IFamily>(key);
            return res.json(ancestors);
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    }

    public async getPartners(req: Request, res: Response): Promise<Response> {
        try {
            const key: string = req.params.key || '';
            const children: IPerson[] = await this.familyService.getPartners<IPerson>(key);
            return res.json(children);
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    }

    public async addParentHood(req: Request, res: Response): Promise<Response> {
        try {
            const key: string = req.params.key || '';
            const body: IPerson = req.body;
            const person: IPerson = await this.familyService.addParentHood<IFamily>(key, body);
            return res.json(person);
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    }

    public async addMarriage(req: Request, res: Response): Promise<Response> {
        try {
            const key: string = req.params.key || '';
            const body: IPerson = req.body;
            const person: IPerson = await this.familyService.addMarriage<IFamily>(key, body);
            return res.json(person);
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    }
}
