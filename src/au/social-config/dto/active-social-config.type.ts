import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ActiveSocialConfigType {
  @Field(() => ID)
  id: string;

  @Field()
  active: boolean;
}
