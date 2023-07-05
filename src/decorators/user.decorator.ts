import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export const User = createParamDecorator(
  (filters: string[], context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (request.user) {
      if (filters && filters.length > 0) {
        const filteredUser = {};

        filters.forEach((filter) => {
          if (request.user.hasOwnProperty(filter)) {
            filteredUser[filter] = request.user[filter];
          }
        });

        return filteredUser;
      } else {
        return request.user;
      }
    } else {
      throw new NotFoundException(
        'User not found in request. Use AuthGuard to get user.',
      );
    }
  },
);
