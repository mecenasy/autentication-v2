import { Command } from '@nestjs/cqrs';
import { GenerateSecretType } from '../../dto/generate-secret.type';

export class GenerateSecretFederationCommand extends Command<GenerateSecretType> {
  constructor(
    public readonly clientId: string,
    public readonly userId: string,
  ) {
    super();
  }
}
