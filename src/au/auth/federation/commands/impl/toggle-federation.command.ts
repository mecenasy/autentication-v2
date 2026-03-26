import { Command } from '@nestjs/cqrs';
import { ToggleFederationType } from '../../dto/toggle-federation.type';

export class ToggleFederationCommand extends Command<ToggleFederationType> {
  constructor(
    public readonly clientId: string,
    public readonly userId: string,
  ) {
    super();
  }
}
