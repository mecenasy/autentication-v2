import { Command } from '@nestjs/cqrs';
import { SessionData } from 'express-session';
import { StatusType } from 'src/authenticator/auth/login/dto/status.type';

export class QrRejectCommand extends Command<StatusType> {
  constructor(
    public readonly session: SessionData,
    public readonly challenge: string,
  ) {
    super();
  }
}
