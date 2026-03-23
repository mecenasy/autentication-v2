import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Context } from '../types/context';
import {
  USER_PROXY_SERVICE_NAME,
  type UserProxyServiceClient,
} from 'src/proto/user';
import { lastValueFrom } from 'rxjs';
import type { ClientGrpc } from '@nestjs/microservices';
import { GrpcProxyKey } from '../proxy/constance';

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  gRpcService: UserProxyServiceClient;
  constructor(
    @Inject(GrpcProxyKey)
    private readonly grpcClient: ClientGrpc,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.gRpcService = this.grpcClient.getService<UserProxyServiceClient>(
      USER_PROXY_SERVICE_NAME,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext<Context>().req;

    if (!request.session.user_id) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }

    const user = await lastValueFrom(
      this.gRpcService.findUserById({ id: request.session.user_id ?? '' }),
    );

    if (!user) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }

    request.user = user;

    return true;
  }
}
