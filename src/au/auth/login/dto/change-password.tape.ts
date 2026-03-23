import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangePasswordType {
  @Field()
  newPassword: string;

  @Field()
  oldPassword: string;
}
