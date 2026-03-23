import { Command } from '@nestjs/cqrs';
import { CreateSocialConfigDto } from '../../dto/create-social-config.dto';
import { SocialConfigType } from '../../dto/social-config.type';

export class CreateSocialConfigCommand extends Command<SocialConfigType> {
  constructor(public readonly socialConfig: CreateSocialConfigDto) {
    super();
  }
}
