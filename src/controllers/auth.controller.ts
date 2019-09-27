import { Database } from 'arangojs';
import { Request, Response } from 'express';
import * as passport from 'passport';
import { IVerifyOptions, Strategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user';
import { UserService } from '../services/user.service';

type Done = (error: any, user?: any, options?: IVerifyOptions) => void;

const config = {
  secret: '123456789'
};

export class AuthController {

  constructor(private database: Database, private userService: UserService) {
    passport.use(new Strategy(async (username: string, password: string, done: Done): Promise<void> => {
      try {
        const user: IUser = await this.userService.getUser(username);
        const valid: boolean = this.isValidPassword(user, password);
        if (!valid) {
          return done(null, false, {message: 'Invalid password'});
        }
        return done(null, user);
      } catch (error) {
        return done(null, false, {message: 'Invalid password'});

      }
    }));
  }

  private isValidPassword(user: IUser, password: string): boolean {
    return password === user.password;
  }

  public isAuthenticated(req: Request, res: Response, next): Response {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
      res.status(400);
      return res.send({
        success: false,
        message: 'No token provided.'
      });
    }
    try {
      const decoded: boolean = jwt.verify(token, config.secret);
      if (decoded) {
        res.status(200);
        req.user = decoded;
        return next();
      }
    } catch (err) {
      res.status(401);
      return res.json({
        success: false,
        message: 'Failed to authenticate token.'
      });
    }

  }

  public me(req: Request, res: Response) {
    const token: string = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
      return res.status(400).send({
        success: false,
        message: 'No token provided.'
      });
    }
    try {
      const decoded: boolean = jwt.verify(token, config.secret);
      if (decoded) {
        res.status(200).json({
          success: true,
          message: 'user authenticated',
          token,
          user: decoded
        });
      }
    } catch (err) {
      res.status(401);
      res.json({
        success: false,
        message: 'Failed to authenticate token.'
      });
    }

  }

  public login(req: Request, res: Response, next) {
    passport.authenticate('local', (authenticateError, authenticatedUser) => {
      if (authenticateError) {
        return next(authenticateError);
      }
      if (!authenticatedUser) {
        return res.status(401).send({
          error: true,
        });
      }
      req.login(authenticatedUser, (err) => {
        if (err) {
          return next(err);
        }
        this.updateUser(authenticatedUser);
        const user = {
          firstname: authenticatedUser.firstname,
          lastname: authenticatedUser.lastname,
          email: authenticatedUser.email,
        };
        res.json({
          status: 'ok',
          message: 'user authenticated',
          user,
          token: this.generateToken(user),
        });
      });
    });
  }

  private generateToken(user: IUser): string {
    return jwt.sign(user, config.secret);
  }

}
