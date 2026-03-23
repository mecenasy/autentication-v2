import { Command } from '@nestjs/cqrs';
import { UpdateSocialConfigDto } from '../../dto/update-social-config.dto';
import { SocialConfigType } from '../../dto/social-config.type';

export class UpdateSocialConfigCommand extends Command<SocialConfigType> {
  constructor(
    public readonly id: string,
    public readonly socialConfig: UpdateSocialConfigDto,
  ) {
    super();
  }
}
