import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteSocialConfigType {
  @Field(() => ID)
  id: string;
}
