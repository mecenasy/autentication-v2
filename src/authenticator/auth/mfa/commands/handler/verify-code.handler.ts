import { Handler } from 'src/common/handler/handler';
import { VerifyCodeCommand } from '../impl/verify-code.command';
import { StatusType } from 'src/authenticator/auth/login/dto/status.type';
import { AuthStatus } from 'src/authenticator/auth/types/login-status';
import { CommandHandler } from '@nestjs/cqrs';
import { LoginCache } from 'src/authenticator/auth/types/cache-data';
import { saveSession } from 'src/authenticator/auth/helpers/save-session';

@CommandHandler(VerifyCodeCommand)
export class VerifyCodeHandler extends Handler<VerifyCodeCommand, StatusType> {
  constructor() {
    super();
  }
  async execute({
    code,
    email,
    session,
  }: VerifyCodeCommand): Promise<StatusType> {
    const cache = await this.cache.getFromCache<LoginCache>({
      identifier: email,
    });

    if (cache?.code !== code) {
      return { status: AuthStatus.logout };
    }
    await this.cache.removeFromCache({ identifier: email });

    session.user_id = cache.userId;

    await saveSession(session, this.logger);

    return { status: AuthStatus.login };
  }
}
