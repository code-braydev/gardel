import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Creamos una interfaz que extienda la de Express
interface RequestWithUser extends Request {
  user?: {
    nombre: string;
    rol: string;
  };
}

@Injectable()
export class MockUserMiddleware implements NestMiddleware {
  use(req: RequestWithUser, res: Response, next: NextFunction) {
    req.user = {
      nombre: 'Brayan Jefe',
      rol: 'jefe',
    };
    next();
  }
}
