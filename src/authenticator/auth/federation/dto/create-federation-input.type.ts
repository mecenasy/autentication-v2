import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUrl, IsBoolean, IsNotEmpty } from 'class-validator';

@InputType()
export class CratedFederationInputType {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl({ require_tld: false })
  @Field()
  clientUrl: string;

  @Field()
  @IsBoolean()
  active: boolean;
}
