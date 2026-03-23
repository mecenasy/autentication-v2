import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsUrl } from 'class-validator';
import { Provider } from 'src/libs/utils/provider';

@ObjectType()
export class SocialConfigType {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;

  @Field(() => Provider)
  @IsEnum(Provider)
  provider: Provider;

  @Field()
  clientId: string;

  @Field()
  secret: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  callbackUrl?: string;

  @Field()
  active: boolean;
}
