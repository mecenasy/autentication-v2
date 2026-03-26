import { Field, InputType } from '@nestjs/graphql';
import { IsUrl } from 'class-validator';

@InputType()
export class CratedFederationInputType {
  @Field()
  name: string;

  @IsUrl({ require_tld: false })
  @Field()
  clientUrl: string;

  @Field()
  active: boolean;
}
