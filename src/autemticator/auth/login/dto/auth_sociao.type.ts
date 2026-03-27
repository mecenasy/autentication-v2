import { Field, InputType } from '@nestjs/graphql';
import { Provider } from 'src/libs/utils/provider';

@InputType()
export class AuthSocial {
  @Field()
  provider: Provider;

  @Field({ nullable: true })
  register?: boolean;
}
