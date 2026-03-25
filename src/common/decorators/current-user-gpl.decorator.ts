import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Context } from '../types/context';
import express from 'express';
import { SocialUser } from 'src/libs/utils/is-social-user';
import { User } from 'src/grpc/user/entity/user.entity';

export const CurrentUserGpl = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const req: express.Request = ctx.getContext<Context>().req;

    return req.user as SocialUser | User;
  },
);
