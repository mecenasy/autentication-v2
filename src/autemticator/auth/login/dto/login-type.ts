import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class LoginType {
  @Field()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;
  @Field()
  password: string;
}
