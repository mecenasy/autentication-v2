import { Command } from '@nestjs/cqrs';
import { CreateFederationType } from '../../dto/create-federation.type';

export class CreateFederationCommand extends Command<CreateFederationType> {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly clientUrl: string,
  ) {
    super();
  }
}
