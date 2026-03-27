import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FederationTokenType {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  email: string;

  @Field()
  secret: string;

  @Field()
  accessTokenExpiredIn: number;

  @Field()
  refreshTokenExpiredIn: number;
}
