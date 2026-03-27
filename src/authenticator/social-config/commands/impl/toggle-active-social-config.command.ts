import { Command } from '@nestjs/cqrs';
import { ActiveSocialConfigType } from '../../dto/active-social-config.type';

export class ToggleActiveSocialConfigCommand extends Command<ActiveSocialConfigType> {
  constructor(public readonly id: string) {
    super();
  }
}
