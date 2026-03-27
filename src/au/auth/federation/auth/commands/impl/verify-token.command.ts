import { Command } from '@nestjs/cqrs';
import { FederationTokenType } from '../../dto/federation-token.type';

export class VerifyTokenFederationCommand extends Command<FederationTokenType> {
  constructor(
    public readonly token: string,
    public readonly secret: string,
    public readonly clientId: string,
  ) {
    super();
  }
}
