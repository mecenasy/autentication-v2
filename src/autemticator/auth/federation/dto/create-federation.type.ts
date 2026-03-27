import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateFederationType {
  @Field()
  name: string;

  @Field()
  clientId: string;

  @Field()
  clientUrl: string;

  @Field()
  isActivated: boolean;
}
