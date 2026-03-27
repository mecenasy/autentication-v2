import { Command } from '@nestjs/cqrs';
import { SessionData } from 'express-session';
import { StatusType } from 'src/authenticator/auth/login/dto/status.type';

export class Verify2faCodeCommand extends Command<StatusType> {
  constructor(
    public readonly email: string,
    public readonly code: string,
    public readonly session: SessionData,
  ) {
    super();
  }
}
