import { Command } from '@nestjs/cqrs';
import { AuthenticationResponseJSON } from '@simplewebauthn/server';
import { SessionData } from 'express-session';
import { StatusType } from 'src/authenticator/auth/login/dto/status.type';

export class VerifyPasskeyFederationCommand extends Command<StatusType> {
  constructor(
    public readonly token: string,
    public readonly response: AuthenticationResponseJSON,
    public readonly session: SessionData,
  ) {
    super();
  }
}
