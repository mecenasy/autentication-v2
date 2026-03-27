import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenerateSecretType {
  @Field()
  secret: string;
}
