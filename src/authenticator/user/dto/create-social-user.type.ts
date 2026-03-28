import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateSocialUserType {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  provider: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  providerId: string;
}
