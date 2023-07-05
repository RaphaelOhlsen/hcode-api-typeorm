import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class CheckUserIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    console.log('CheckUserIdMiddleware after');
    if (isNaN(Number(id)) || Number(id) <= 0) {
      throw new BadRequestException('Id must be a positive number');
    }
    console.log('CheckUserIdMiddleware before');
    next();
  }
}
