import { CommandHandler } from '@nestjs/cqrs';
import { AuthStatus } from 'src/authenticator/auth/types/login-status';
import { StatusType } from '../../dto/status.type';
import { Handler } from 'src/common/handler/handler';
import { lastValueFrom } from 'rxjs';
import { SocialCreateCommand } from '../impl/social-create.command';
import {
  USER_PROXY_SERVICE_NAME,
  UserProxyServiceClient,
} from 'src/proto/user';
import { saveSession } from 'src/authenticator/auth/helpers/save-session';

@CommandHandler(SocialCreateCommand)
export class CreateUserHandler extends Handler<
  SocialCreateCommand,
  StatusType,
  UserProxyServiceClient
> {
  constructor() {
    super(USER_PROXY_SERVICE_NAME);
  }

  async execute({ session, user }: SocialCreateCommand) {
    const result = await lastValueFrom(this.gRpcService.createSocialUser(user));

    session.user_id = result.id;

    await saveSession(session, this.logger);

    return { status: AuthStatus.login };
  }
}
