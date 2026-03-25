import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import express from 'express';
import { User } from 'src/grpc/user/entity/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return context.switchToHttp().getRequest<express.Request>().user as User;
  },
);
