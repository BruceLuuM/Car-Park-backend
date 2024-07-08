import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith('Bearer')
    ) {
      // req.currentUser = null;
      next();
      return;
      // return;
    } else {
      try {
        const token = authHeader.split(' ')[1];
        try {
          const { id } = <jwtPayLoad>(
            verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
          );
          const currentUser = await this.userService.findOne(+id);
          req.currentUser = currentUser;
          next();
        } catch (error) {
          // If ID is not found or access token verification fails, check for a refresh token
          if (
            error.message.includes('id not found') ||
            error.name === 'TokenExpiredError'
          ) {
            // try {
            //   // Verify refresh token
            //   const { id } = <jwtPayLoad>(
            //     verify(token, process.env.REFRESH_TOKEN_SECRET_KEY)
            //   );
            //   const newCurrentUser = await this.userService.findOne(+id);
            //   req.currentUser = newCurrentUser;
            //   next();
            // } catch (refreshError) {
            //   // Handle refresh token errors, e.g., invalid or expired
            //   res.status(401).json({ message: 'Unauthorized' });
            // }

            res.status(401).json(error);
          } else {
            // Handle other errors
            next(error);
          }
        }
      } catch (err) {
        req.currentUser = null;
        next();
      }
    }
  }
}

interface jwtPayLoad {
  id: string;
}
