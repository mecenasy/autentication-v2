import { CommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl/create-user.command';
import { Inject } from '@nestjs/common';
import { ClientProxy, type ClientGrpc } from '@nestjs/microservices';
import { GrpcProxyKey, ProxyKey } from 'src/common/proxy/constance';
import { lastValueFrom } from 'rxjs';
import { Handler } from 'src/common/handler/handler';
import { SocialUserResponse } from 'src/proto/user';
import { CreateSocialUserCommand } from '../impl/create-social-user.command';

@CommandHandler(CreateUserCommand)
export class CreateSocialUserHandler extends Handler<
  CreateSocialUserCommand,
  SocialUserResponse
> {
  constructor(
    @Inject(GrpcProxyKey) public readonly grpcClient: ClientGrpc,
    @Inject(ProxyKey) public readonly client: ClientProxy,
  ) {
    super(grpcClient, client);
  }

  async execute(command: CreateSocialUserCommand) {
    const { user: userToCreate } = command;

    const user = await lastValueFrom(
      this.gRpcService.createSocialUser(userToCreate),
    );

    await this.saveInCache({
      identifier: user.id,
      data: user,
      EX: 3600,
      prefix: 'user',
    });

    this.createUserEvent('social_user_creates', user);

    return user;
  }
}
