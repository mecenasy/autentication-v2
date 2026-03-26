import { Command } from '@nestjs/cqrs';
import { RemoveFederationType } from '../../dto/remove.federation.type';

export class RemoveFederationCommand extends Command<RemoveFederationType> {
  constructor(
    public readonly clientId: string,
    public readonly userId: string,
  ) {
    super();
  }
}
