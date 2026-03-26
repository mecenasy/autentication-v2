import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ToggleFederationType {
  @Field()
  active: boolean;

  @Field(() => ID)
  clientId: string;
}
