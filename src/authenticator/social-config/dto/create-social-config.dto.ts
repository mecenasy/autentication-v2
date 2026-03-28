import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsString, IsBoolean } from 'class-validator';
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

  @Field()
  @IsBoolean()
  active: boolean;
}
