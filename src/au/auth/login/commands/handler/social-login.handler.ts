import { CommandHandler } from '@nestjs/cqrs';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { StatusType } from '../../dto/status.type';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Handler } from 'src/common/handler/handler';
import { lastValueFrom } from 'rxjs';
import { SocialLoginCommand } from '../impl/social-login.command';
import {
  USER_PROXY_SERVICE_NAME,
  UserProxyServiceClient,
} from 'src/proto/user';

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

    await new Promise<void>((resolve, reject) => {
      session.save((err) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to save session.'));
          this.logger.error(err);
        } else {
          resolve();
        }
      });
    });

    return { status: AuthStatus.login };
  }
}
