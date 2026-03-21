import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateSocialUserType {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  provider: string;

  @Field()
  providerId: string;
}
