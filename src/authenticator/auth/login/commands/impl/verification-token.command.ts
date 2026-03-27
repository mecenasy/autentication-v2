import { Command } from '@nestjs/cqrs';
import { StatusType } from '../../dto/status.type';
import { SessionData } from 'express-session';

export class VerificationTokenCommand extends Command<StatusType> {
  constructor(
    public readonly token: string,
    public readonly session: SessionData,
  ) {
    super();
  }
}
