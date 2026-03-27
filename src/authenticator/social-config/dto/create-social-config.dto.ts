import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import {
  IsEnum,
  IsString,
  IsOptional,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { Provider } from 'src/libs/utils/provider';

registerEnumType(Provider, { name: 'Provider' });

@InputType()
export class CreateSocialConfigDto {
  @Field()
  @IsString()
  name: string;

  @Field(() => Provider)
  @IsEnum(Provider)
  provider: Provider;

  @Field()
  @IsString()
  clientId: string;

  @Field()
  @IsString()
  secret: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({ require_tld: false })
  callbackUrl?: string;

  @Field()
  @IsBoolean()
  active: boolean;
}
