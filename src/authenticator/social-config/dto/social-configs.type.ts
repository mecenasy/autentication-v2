import { Field, ObjectType } from '@nestjs/graphql';
import { SocialConfigType } from './social-config.type';

@ObjectType()
export class SocialConfigsType {
  @Field(() => [SocialConfigType])
  configs: SocialConfigType[];
}
