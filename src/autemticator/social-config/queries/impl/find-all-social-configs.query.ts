import { Query } from '@nestjs/cqrs';
import { SocialConfigsType } from '../../dto/social-configs.type';

export class GetAllSocialConfigsQuery extends Query<SocialConfigsType> {}
