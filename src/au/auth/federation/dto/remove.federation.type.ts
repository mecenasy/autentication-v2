import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveFederationType {
  @Field()
  clientId: string;
}
