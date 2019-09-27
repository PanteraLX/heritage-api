import { Request, Response } from 'express';
import { IUser } from '../models/user';
import { UserService } from '../services/user.service';

export class UserController {
    constructor(private userService: UserService) {
    }

    public async authenticate(req: Request, res: Response, next): Promise<Response> {
        try {
            const body: IUser = req.body;
            const user: IUser = await this.userService.authenticate(body);
            return user ? res.json(user) : res.status(400).json({message: 'Username oder Passwort ist falsch'});
        } catch (error) {
            res.status(400).json({message: error});
        }
    }

    public async register(req: Request, res: Response, next): Promise<Response> {
        try {
            const body: IUser = req.body;
            const user: IUser = await this.userService.addUser(body);
            return res.json(user);
        } catch (error) {
            res.status(400).json({message: error});
        }
    }

    public async getUser(req: Request, res: Response): Promise<Response> {
        const username: string = req.params.username || '';
        const person: IUser = await this.userService.getUser(username);
        return res.json(person);
    }

    public async getUsers(req: Request, res: Response): Promise<Response> {
        const persons: IUser[] = await this.userService.getUsers();
        return res.json(persons);
    }

    public async getCurrent(req: Request, res: Response): Promise<Response> {
        const key: string = (req.user as any).sub || '';
        const person: IUser = await this.userService.getUser(key);
        return res.json(person);
    }

    public async updateUser(req: Request, res: Response): Promise<Response> {
        const body: IUser = req.body;
        const user: IUser = await this.userService.updateUser(body);
        return res.json(user);
    }
}
