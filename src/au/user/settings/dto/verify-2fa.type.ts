import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class Accept2faType {
  @Field()
  code: number;
}
