import { CommandHandler } from '@nestjs/cqrs';
import { lastValueFrom } from 'rxjs';
import { Handler } from 'src/common/handler/handler';
import {
  USER_PROXY_SERVICE_NAME,
  UserProxyServiceClient,
} from 'src/proto/user';
import { CreateSocialUserCommand } from '../impl/create-social-user.command';
import { StatusResponse } from '../../../auth/login/response/status.response';
import { AuthStatus } from 'src/authenticator/auth/types/login-status';
import { saveSession } from 'src/authenticator/auth/helpers/save-session';

@CommandHandler(CreateSocialUserCommand)
export class CreateSocialUserHandler extends Handler<
  CreateSocialUserCommand,
  StatusResponse,
  UserProxyServiceClient
> {
  constructor() {
    super(USER_PROXY_SERVICE_NAME);
  }

  async execute(command: CreateSocialUserCommand) {
    const { user: userToCreate, session } = command;
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

    session.user_id = user.id;

    await saveSession(session, this.logger);

    return { status: AuthStatus.login };
  }
}
