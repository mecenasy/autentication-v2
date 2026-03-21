import { CommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl/create-user.command';
import { BadRequestException, Inject } from '@nestjs/common';
import { ClientProxy, type ClientGrpc } from '@nestjs/microservices';
import { GrpcProxyKey, ProxyKey } from 'src/common/proxy/constance';
import { lastValueFrom } from 'rxjs';
import { Handler } from 'src/common/handler/handler';
import { UserResponse } from 'src/proto/user';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler extends Handler<
  CreateUserCommand,
  UserResponse
> {
  constructor(
    @Inject(GrpcProxyKey) public readonly grpcClient: ClientGrpc,
    @Inject(ProxyKey) public readonly client: ClientProxy,
  ) {
    super(grpcClient, client);
  }

  async execute(command: CreateUserCommand) {
    const { user: userToCreate } = command;

    const { exist } = await lastValueFrom(
      this.gRpcService.checkExist(userToCreate),
    );

    if (!exist) {
      throw new BadRequestException("Sorry we con't create this account");
    }

    const user = await lastValueFrom(this.gRpcService.createUser(userToCreate));

    await this.saveInCache({
      identifier: user.id,
      data: user,
      EX: 3600,
      prefix: 'user',
    });

    this.createUserEvent('user_creates', user);

    return user;
  }
}
