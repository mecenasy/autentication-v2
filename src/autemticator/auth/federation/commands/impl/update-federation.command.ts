import { Command } from '@nestjs/cqrs';
import { CreateFederationType } from '../../dto/create-federation.type';

export class UpdateFederationCommand extends Command<CreateFederationType> {
  constructor(
    public readonly name: string,
    public readonly clientUrl: string,
    public readonly clientId: string,
    public readonly userId: string,
    public readonly active: boolean,
  ) {
    super();
  }
}
