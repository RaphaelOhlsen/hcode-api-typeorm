import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParamId = createParamDecorator(
  (_data, context: ExecutionContext) => {
    const id = Number(context.switchToHttp().getRequest().params.id);
    return id;
  },
);
