import { Command } from '@nestjs/cqrs';
import { SessionData } from 'express-session';
import { StatusType } from 'src/authenticator/auth/login/dto/status.type';

export class VerifyCodeCommand extends Command<StatusType> {
  constructor(
    public readonly email: string,
    public readonly code: number,
    public readonly session: SessionData,
  ) {
    super();
  }
}
