import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DiscoveryFederationType {
  @Field()
  token: string;

  @Field()
  clientUrl: string;
}
