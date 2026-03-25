import { CommandHandler } from '@nestjs/cqrs';
import { Handler } from 'src/common/handler/handler';
import { QrRejectCommand } from '../impl/gr-reject.command';
import { BadRequestException } from '@nestjs/common';
import { QrCache } from './types/types';
import { Getaway } from 'src/common/getaway/getaway.getaway';
import { saveSession } from 'src/au/auth/helpers/save-session';
import { StatusType } from 'src/au/auth/login/dto/status.type';
import { AuthStatus } from 'src/au/auth/types/login-status';

@CommandHandler(QrRejectCommand)
export class QrRejectHandler extends Handler<QrRejectCommand, StatusType> {
  constructor(private readonly gateway: Getaway) {
    super();
  }

  async execute({ challenge, session }: QrRejectCommand) {
    if (!challenge) {
      throw new BadRequestException('Challenge is required');
    }

    const result = await this.cache.getFromCache<QrCache>({
      identifier: challenge,
      prefix: 'qr-challenge',
    });

    if (!result) {
      return { status: AuthStatus.logout };
    }

    session.currentChallenge = undefined;

    this.sendAuthStatus('rejected', result);
    await saveSession(session, this.logger);
    await this.cache.removeFromCache({
      identifier: challenge,
      prefix: 'qr-challenge',
    });

    return { status: AuthStatus.logout };
  }

  private sendAuthStatus(
    status: 'rejected' | 'verified' | 'unVerified',
    data: QrCache,
  ) {
    this.gateway.server.to(data.challenge).emit('challenge', {
      status,
      type: 'QR-AUTH',
      nonce: data.nonce,
    });
  }
}
