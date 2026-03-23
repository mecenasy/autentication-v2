import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class Verify2faCodeType {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  code: string;
}
