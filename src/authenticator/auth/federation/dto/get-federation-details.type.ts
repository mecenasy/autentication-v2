import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetFederationDetailsType {
  @Field()
  name: string;

  @Field()
  clientId: string;

  @Field()
  clientUrl: string;

  @Field()
  isActivated: boolean;

  @Field()
  verifyUrl: string;

  @Field()
  loginUrl: string;
}
