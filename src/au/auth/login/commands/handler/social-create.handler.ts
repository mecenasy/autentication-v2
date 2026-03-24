import { CommandHandler } from '@nestjs/cqrs';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { StatusType } from '../../dto/status.type';
import { InternalServerErrorException } from '@nestjs/common';
import { Handler } from 'src/common/handler/handler';
import { lastValueFrom } from 'rxjs';
import { SocialCreateCommand } from '../impl/social-create.command';
import {
  USER_PROXY_SERVICE_NAME,
  UserProxyServiceClient,
} from 'src/proto/user';

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
