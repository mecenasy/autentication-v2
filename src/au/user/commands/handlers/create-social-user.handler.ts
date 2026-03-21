import { CommandHandler } from '@nestjs/cqrs';
import { lastValueFrom } from 'rxjs';
import { Handler } from 'src/common/handler/handler';
import {
  SocialUserResponse,
  USER_PROXY_SERVICE_NAME,
  UserProxyServiceClient,
} from 'src/proto/user';
import { CreateSocialUserCommand } from '../impl/create-social-user.command';

@CommandHandler(CreateSocialUserCommand)
export class CreateSocialUserHandler extends Handler<
  CreateSocialUserCommand,
  SocialUserResponse,
  UserProxyServiceClient
> {
  constructor() {
    super(USER_PROXY_SERVICE_NAME);
  }

  async execute(command: CreateSocialUserCommand) {
    const { user: userToCreate } = command;
    this.logger.log(userToCreate);

    const user = await lastValueFrom(
      this.gRpcService.createSocialUser(userToCreate),
    );

    await this.cache.saveInCache({
      identifier: user.id,
      data: user,
      EX: 3600,
      prefix: 'user',
    });

    return user;
  }
}
