import { Query } from '@nestjs/cqrs';
import { SocialConfigType } from '../../dto/social-config.type';

export class GetSocialConfigByIdQuery extends Query<SocialConfigType> {
  constructor(public readonly id: string) {
    super();
  }
}
