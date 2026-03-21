import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateUserType {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  phone: string;

  @Field()
  password: string;
}
