import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class ResetPasswordType {
  @Field()
  @IsUUID()
  token: string;

  @Field()
  password: string;
}
