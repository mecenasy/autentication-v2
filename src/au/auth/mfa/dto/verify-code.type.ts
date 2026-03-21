import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class VerifyCodeType {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  code: number;
}
