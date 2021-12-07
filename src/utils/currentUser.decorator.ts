import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const currentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = context.switchToHttp().getRequest();
    return ctx.user;
  },
);
