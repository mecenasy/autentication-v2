/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Context } from '../types/context';
import { AuthSocial } from 'src/au/auth/login/dto/auth_sociao.type';

@Injectable()
export class DynamicGplAuthGuard extends AuthGuard([
  'google',
  'facebook',
  'twitter',
  'github',
  'linkedin',
]) {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const {
      data: { provider, register },
    } = ctx.getArgs<{ data: AuthSocial }>();

    const request = ctx.getContext<Context>().req;

    if (!provider) {
      throw new BadRequestException(
        'Provider is required as a GraphQL argument',
      );
    }

    request.params = { ...request.params, provider };

    if (register === true) {
      request.session.isRegister = true;
      await new Promise<void>((resolve) =>
        request.session.save(() => resolve()),
      );
    }

    if (!(request as any)._passport) {
      (request as any)._passport = {
        instance: {
          _strategies: {},
          _serializers: [],
          _deserializers: [],
          _infoTransformers: [],
        },
      };
    }

    // Definiujemy puste funkcje, których szuka Passport
    if (typeof request.logIn !== 'function')
      request.logIn = (user, done) => done(null);
    if (typeof request.login !== 'function')
      request.login = (user, done) => done(null);
    if (typeof request.logOut !== 'function') request.logOut = () => {};
    if (typeof request.logout !== 'function') request.logout = () => {};
    if (typeof (request as any).isAuthenticated !== 'function')
      (request as any).isAuthenticated = () => false;
    const PassportGuardClass = AuthGuard(provider);
    const instance = new PassportGuardClass();
    console.log('🚀 ~ DynamicGplAuthGuard ~ canActivate ~ instance:', instance);
    // if (!request.logIn) {
    //   (request as any).logIn = (user, opts, done: any) => done?.(null);
    // }
    console.log(
      '🚀 ~ DynamicGplAuthGuard ~ canActivate ~ request:',
      request.logIn,
    );
    return instance.canActivate(context) as Promise<boolean>;
  }

  getRequest(context: ExecutionContext) {
    console.log('🚀 ~ DynamicGplAuthGuard ~ getRequest ~ context:', context);
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<Context>().req;
  }
}
