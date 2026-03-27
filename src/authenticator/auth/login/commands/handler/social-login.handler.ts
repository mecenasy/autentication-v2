import { CommandHandler } from '@nestjs/cqrs';
import { AuthStatus } from 'src/authenticator/auth/types/login-status';
import { StatusType } from '../../dto/status.type';
import { BadRequestException } from '@nestjs/common';
import { Handler } from 'src/common/handler/handler';
import { lastValueFrom } from 'rxjs';
import { SocialLoginCommand } from '../impl/social-login.command';
import {
  USER_PROXY_SERVICE_NAME,
  UserProxyServiceClient,
} from 'src/proto/user';
import { saveSession } from 'src/authenticator/auth/helpers/save-session';

@CommandHandler(SocialLoginCommand)
export class SocialLoginHandler extends Handler<
  SocialLoginCommand,
  StatusType,
  UserProxyServiceClient
> {
  constructor() {
    super(USER_PROXY_SERVICE_NAME);
  }

  async execute({ user, session }: SocialLoginCommand) {
    const result = await lastValueFrom(this.gRpcService.findSocialUser(user));

    if (!result) {
      throw new BadRequestException('User not found');
    }

    session.user_id = result.id;

    await saveSession(session, this.logger);

    return { status: AuthStatus.login };
  }
}
