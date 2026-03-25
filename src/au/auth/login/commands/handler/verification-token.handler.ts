import { CommandHandler } from '@nestjs/cqrs';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { StatusType } from '../../dto/status.type';
import { BadRequestException } from '@nestjs/common';
import { Handler } from 'src/common/handler/handler';
import { lastValueFrom } from 'rxjs';
import { VerificationTokenCommand } from '../impl/verification-token.command';
import {
  USER_PROXY_SERVICE_NAME,
  UserProxyServiceClient,
} from 'src/proto/user';
import { saveSession } from 'src/au/auth/helpers/save-session';

@CommandHandler(VerificationTokenCommand)
export class VerificationTokenHandler extends Handler<
  VerificationTokenCommand,
  StatusType,
  UserProxyServiceClient
> {
  constructor() {
    super(USER_PROXY_SERVICE_NAME);
  }

  async execute({ token, session }: VerificationTokenCommand) {
    const email = await this.cache.getFromCache<string>({
      identifier: token,
      prefix: 'verify-token',
    });

    if (!email) {
      throw new BadRequestException('TOKEN_EXPIRED');
    }

    const result = await lastValueFrom(this.gRpcService.findUser({ email }));
    session.user_id = result.id;

    await this.cache.removeFromCache({
      identifier: token,
      prefix: 'verify-token',
    });

    await saveSession(session, this.logger);

    return { status: AuthStatus.login };
  }
}
