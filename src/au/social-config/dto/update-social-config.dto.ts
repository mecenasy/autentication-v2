import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsString,
  IsOptional,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { Provider } from 'src/libs/utils/provider';

@InputType()
export class UpdateSocialConfigDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => Provider, { nullable: true })
  @IsOptional()
  @IsEnum(Provider)
  provider?: Provider;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  clientId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  secret?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  callbackUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
