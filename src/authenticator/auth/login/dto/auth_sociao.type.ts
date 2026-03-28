import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Provider } from 'src/libs/utils/provider';

@InputType()
export class AuthSocial {
  @Field()
  @IsEnum(Provider)
  provider: Provider;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  register?: boolean;
}
