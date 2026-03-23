import { Command } from '@nestjs/cqrs';
import { DeleteSocialConfigType } from '../../dto/delete-social-config.type';

export class DeleteSocialConfigCommand extends Command<DeleteSocialConfigType> {
  constructor(public readonly id: string) {
    super();
  }
}
