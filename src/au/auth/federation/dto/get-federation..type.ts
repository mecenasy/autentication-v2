import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetFederationType {
  @Field()
  name: string;

  @Field()
  clientId: string;
}
