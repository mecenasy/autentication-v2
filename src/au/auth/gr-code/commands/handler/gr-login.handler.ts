import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { QrLoginCommand } from '../impl/gr-login.command';
import { BadRequestException } from '@nestjs/common';
import { QrCache } from './types/types';
import { StatusType } from 'src/au/auth/login/dto/status.type';
import { AuthStatus } from 'src/au/auth/types/login-status';
import { saveSession } from 'src/au/auth/helpers/save-session';

@CommandHandler(QrLoginCommand)
export class QrLoginHandler extends Handler<QrLoginCommand, StatusType> {
  constructor() {
    super();
  }

  async execute({ challenge, nonce, session }: QrLoginCommand) {
    if (!(challenge && nonce)) {
      throw new BadRequestException('Challenge is required');
    }

    const result = await this.cache.getFromCache<QrCache>({
      identifier: challenge,
      prefix: 'qr-challenge',
    });

    if (result?.status !== 'verified' || result.challenge !== challenge) {
      throw new BadRequestException('Wrong challenge');
    }

    if (
      result &&
      result?.status === 'verified' &&
      result.userId &&
      result.nonce === nonce
    ) {
      session.user_id = result.userId;

      await saveSession(session, this.logger);

      await this.cache.removeFromCache({
        identifier: challenge,
        prefix: 'qr-challenge',
      });
      return { status: AuthStatus.login };
    } else {
      return { status: AuthStatus.logout };
    }
  }
}
